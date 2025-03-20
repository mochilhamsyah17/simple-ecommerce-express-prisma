import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { getProducts, postProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/post-products", authenticate, authorize("admin"), postProduct);

export default router;
