import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { createPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", authenticate, authorize("user"), createPayment);

export default router;
