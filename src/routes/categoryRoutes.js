import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", authenticate, authorize("admin"), createCategory);
router.get("/", authenticate, getCategories);

export default router;
