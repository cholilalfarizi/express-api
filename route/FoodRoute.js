import express from "express";
import {
  getFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from "../controller/FoodController.js";

const router = express.Router();

router.get("/foods", getFood);
router.get("/foods/:id", getFoodById);
router.post("/foods", createFood);
router.patch("/foods/:id", updateFood);
router.delete("/foods/:id", deleteFood);

export default router;
