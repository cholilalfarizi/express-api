import Transaction from "../model/TransactionModel.js";
import TransactionDetail from "../model/TransactionDetailModel.js";
import Food from "../model/FoodModel.js";
import { responseMessage } from "../utils/responseMessage.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import Customer from "../model/CustomerModel.js";
import sequelize from "sequelize";
import db from "../config/database.js";

export const createTransaction = async (req, res) => {
  const { customer_id, food_items } = req.body;

  if (!customer_id || !food_items || !food_items.length) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        responseMessage(
          StatusCodes.BAD_REQUEST,
          "Customer ID and food items are required",
          getReasonPhrase(StatusCodes.BAD_REQUEST)
        )
      );
  }

  const t = await db.transaction();

  try {
    let total_item = 0;
    let total_price = 0;
    let stockError = null; // Variable untuk menyimpan error terkait stok

    const foodDetails = await Promise.all(
      food_items.map(async (item) => {
        const food = await Food.findByPk(item.food_id);

        if (!food) {
          throw new Error(`Food item with ID ${item.food_id} not found`);
        }

        // Check stock availability
        if (food.stock < item.qty) {
          stockError = `Not enough stock for ${food.name}`;
          return null; // Berhenti memproses jika stok tidak cukup
        }

        total_item += item.qty;
        total_price += food.price * item.qty;

        // Update the stock
        food.stock -= item.qty;
        await food.save({ transaction: t });

        return { food, qty: item.qty };
      })
    );

    if (stockError) {
      // Rollback transaksi dan kirim respons error
      await t.rollback();
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          responseMessage(
            StatusCodes.BAD_REQUEST,
            stockError,
            getReasonPhrase(StatusCodes.BAD_REQUEST)
          )
        );
    }

    const transaction = await Transaction.create(
      {
        customer_id,
        total_item,
        total_price,
        transaction_date: new Date(),
        is_deleted: false,
      },
      { transaction: t }
    );

    await Promise.all(
      foodDetails.map(async ({ food, qty }) => {
        await TransactionDetail.create(
          {
            transaction_id: transaction.transaction_id,
            food_id: food.food_id,
            qty,
            total_price: food.price * qty,
          },
          { transaction: t }
        );
      })
    );

    await t.commit();
    res
      .status(StatusCodes.CREATED)
      .json(
        responseMessage(
          StatusCodes.CREATED,
          "Transaction Created Successfully",
          getReasonPhrase(StatusCodes.CREATED)
        )
      );
  } catch (error) {
    await t.rollback();
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        responseMessage(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        )
      );
  }
};

export const getTransaction = async (req, res) => {
  try {
    const response = await Transaction.findAll({
      where: {
        is_deleted: false,
      },
    });

    if (response.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            "No Transaction Found",
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Get Transaction Successfully",
          getReasonPhrase(StatusCodes.OK),
          response
        )
      );
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        responseMessage(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        )
      );
  }
};

export const getTransactionById = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const queryOption = {
      include: [
        { model: Customer, attributes: ["name"] },
        {
          model: TransactionDetail,
          attributes: ["qty", "total_price"],
          include: [
            {
              model: Food,
              attributes: ["food_id", "name", "price"],
            },
          ],
        },
      ],
      attributes: ["total_price", "transaction_date"],
    };

    if (transaction_id) {
      queryOption.where = { transaction_id };
    }

    const transactions = await Transaction.findOne(queryOption);
    if (!transactions || transactions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Transaction with ID ${transaction_id} not found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Get Transaction Successfully",
          getReasonPhrase(StatusCodes.OK),
          transactions
        )
      );
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        responseMessage(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        )
      );
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { transactionDetails } = req.body;

  console.log("Transaction ID:", id);

  // Mulai transaksi
  const t = await db.transaction();

  try {
    // Cari transaksi yang akan diupdate
    const transaction = await Transaction.findOne({
      where: {
        transaction_id: id,
        is_deleted: false,
      },
      transaction: t, // Gunakan transaksi
    });

    if (!transaction) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Transaction with ID ${id} not found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    let total_item = 0;
    let total_price = 0;

    // Dapatkan detail transaksi lama untuk memulihkan stok
    const oldDetails = await TransactionDetail.findAll({
      where: { transaction_id: id },
      transaction: t, // Gunakan transaksi
    });

    // Kembalikan stok dari detail transaksi lama
    for (const detail of oldDetails) {
      const food = await Food.findByPk(detail.food_id, { transaction: t });
      if (food) {
        food.stock += detail.qty; // Kembalikan stok
        await food.save({ transaction: t });
      }
    }

    // Hapus detail transaksi lama
    await TransactionDetail.destroy({
      where: { transaction_id: id },
      transaction: t,
    });

    // Proses detail transaksi baru
    for (const detail of transactionDetails) {
      const food = await Food.findOne({
        where: { food_id: detail.food_id, is_deleted: false },
        transaction: t,
      });

      if (!food) {
        throw new Error(`Food with ID ${detail.food_id} not found`);
      }

      // Cek stok ketersediaan
      if (food.stock < detail.qty) {
        throw new Error(
          `Not enough stock for food item with ID ${detail.food_id}`
        );
      }

      total_item += detail.qty;
      total_price += food.price * detail.qty;

      // Kurangi stok
      food.stock -= detail.qty;
      await food.save({ transaction: t });

      // Buat detail transaksi baru
      await TransactionDetail.create(
        {
          transaction_id: id,
          food_id: detail.food_id,
          qty: detail.qty,
          total_price: food.price * detail.qty,
        },
        { transaction: t }
      );
    }

    // Update transaksi utama
    await Transaction.update(
      { total_item, total_price, is_deleted: false },
      { where: { transaction_id: id }, transaction: t }
    );

    // Commit transaksi jika semua berhasil
    await t.commit();
    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Transaction Updated Successfully",
          getReasonPhrase(StatusCodes.OK)
        )
      );
  } catch (error) {
    // Rollback transaksi jika terjadi kesalahan
    await t.rollback();
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        responseMessage(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        )
      );
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowCount] = await Transaction.update(
      { is_deleted: true },
      {
        where: {
          transaction_id: id,
        },
      }
    );

    if (updatedRowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Transaction with ID ${id} Not Found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Transaction Deleted Successfully",
          getReasonPhrase(StatusCodes.OK)
        )
      );
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        responseMessage(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        )
      );
  }
};
