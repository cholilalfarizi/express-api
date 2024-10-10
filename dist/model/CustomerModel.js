import { Sequelize } from "sequelize";
import db from "../config/database.js";
// import { DataTypes } from '@sequelize/core';

const {
  DataTypes
} = Sequelize;
const Customer = db.define("customers", {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Jika customerId di tabel auto increment
  },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  is_deleted: DataTypes.BOOLEAN
}, {
  freezeTableName: true,
  timestamps: false
});
export default Customer;