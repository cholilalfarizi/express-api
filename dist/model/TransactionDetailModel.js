import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Food from "./FoodModel.js";
const {
  DataTypes
} = Sequelize;
const TransactionDetail = db.define("transaction_detail", {
  transactions_detail_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});
TransactionDetail.belongsTo(Food, {
  foreignKey: "food_id"
});
export default TransactionDetail;