import express from "express";
import {
  createOrder,
  getOrder,
  getOrderByUser,
} from "../controllers/orderController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID of the user placing the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product ordered
 *       example:
 *         userId: 3
 *         items:
 *           - productId: 1
 *             quantity: 2
 *           - productId: 2
 *             quantity: 1
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Place an order with a list of products and quantities.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders.
 *     tags: [Orders]
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
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get my orders
 *     description: Retrieve a list of orders for the authenticated user.
 *     tags: [Orders]
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
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 * */
const router = express.Router();

router.post("/", authenticate, authorize("user"), createOrder);
router.get("/", authenticate, authorize("admin"), getOrder);
router.get("/my-orders", authenticate, authorize("user"), getOrderByUser);

export default router;
