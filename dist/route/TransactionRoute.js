import express from "express";
import { createTransaction, getTransaction, getTransactionById, updateTransaction, deleteTransaction } from "../controller/TransactionController.js";
const router = express.Router();
router.get("/transactions", getTransaction);
router.get("/transactions/:transaction_id", getTransactionById);
router.post("/transactions", createTransaction);
router.patch("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);
export default router;