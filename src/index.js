import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import CustomerRoute from "./route/CustomerRoute.js";
import FoodRoute from "./route/FoodRoute.js";
import TransactionRoute from "./route/TransactionRoute.js";
const app = express();
const PORT = 5000;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(CustomerRoute);
app.use(FoodRoute);
app.use(TransactionRoute);

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
