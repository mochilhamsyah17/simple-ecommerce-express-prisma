import express from "express";
import {
  createOrder,
  getOrder,
  getOrderByUser,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("user"), createOrder);
router.get("/", authenticate, authorize("admin"), getOrder);
router.get("/my-orders", authenticate, authorize("user"), getOrderByUser);

export default router;
