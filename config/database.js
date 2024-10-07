// import mysql from "mysql";
import { Sequelize } from "sequelize";

const db = new Sequelize("db_food_order", "root", "admin123", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

export default db;

(async () => {
  await db.sync();
})();
