import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  deleteMultipleProducts,
  getProducts,
  postProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productName
 *         - price
 *         - stockQuantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The unique ID of the product
 *         productName:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: integer
 *           description: The price of the product
 *         stockQuantity:
 *           type: integer
 *           description: The available stock of the product
 *       example:
 *         productId: 1
 *         productName: "Product A"
 *         price: 100000
 *         stockQuantity: 10
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/products/post-products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             productName: "Product A"
 *             price: 100000
 *             stockQuantity: 10
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 */

router.get("/", getProducts);
router.post("/post-products", authenticate, authorize("admin"), postProduct);
router.put("/update", authenticate, authorize("admin"), updateProduct);
router.delete(
  "/delete",
  authenticate,
  authorize("admin"),
  deleteMultipleProducts
);

export default router;
