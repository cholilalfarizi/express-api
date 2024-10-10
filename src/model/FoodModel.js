import { Sequelize } from "sequelize";
import db from "../config/database.js";
// import { DataTypes } from '@sequelize/core';

const { DataTypes } = Sequelize;

const Food = db.define(
  "foods",
  {
    food_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Jika FoodId di tabel auto increment
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    is_deleted: DataTypes.BOOLEAN,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Food;
