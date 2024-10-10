import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Customer from "./CustomerModel.js";
import TransactionDetail from "./TransactionDetailModel.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transactions",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_item: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Transaction.belongsTo(Customer, { foreignKey: "customer_id" });
Transaction.hasMany(TransactionDetail, { foreignKey: "transaction_id" });

export default Transaction;
