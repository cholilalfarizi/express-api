import Food from "../model/FoodModel.js";
import { responseMessage } from "../utils/responseMessage.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const getFood = async (req, res) => {
  try {
    const response = await Food.findAll({
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
            "No Foods Found",
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Get Food Successfully",
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

export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Food.findOne({
      where: {
        food_id: id,
      },
    });

    if (!response) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Food with ID ${id} Not Found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Get Food Successfully",
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

export const createFood = async (req, res) => {
  try {
    await Food.create({ ...req.body, is_deleted: false });
    res
      .status(StatusCodes.CREATED)
      .json(
        responseMessage(
          StatusCodes.CREATED,
          "Food Created Successfully",
          getReasonPhrase(StatusCodes.CREATED)
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

export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowCount] = await Food.update(req.body, {
      where: {
        Food_id: id,
      },
    });

    if (updatedRowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Food with ID ${id} Not Found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }

    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Food Updated Successfully",
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

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowCount] = await Food.update(
      { is_deleted: true },
      {
        where: {
          Food_id: id,
        },
      }
    );

    if (updatedRowCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          responseMessage(
            StatusCodes.NOT_FOUND,
            `Food with ID ${id} Not Found`,
            getReasonPhrase(StatusCodes.NOT_FOUND)
          )
        );
    }
    res
      .status(StatusCodes.OK)
      .json(
        responseMessage(
          StatusCodes.OK,
          "Food Deleted Successfully",
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
