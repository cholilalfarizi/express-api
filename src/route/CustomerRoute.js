import express from "express";
import {
  getCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controller/CustomerController.js";

const router = express.Router();

router.get("/customers", getCustomer);
router.get("/customers/:id", getCustomerById);
router.post("/customers", createCustomer);
router.patch("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

export default router;
