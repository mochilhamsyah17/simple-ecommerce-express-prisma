import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  changePassword,
  deleteUser,
  getMyInfo,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *       example:
 *         name: John Doe
 *         email: 5mHd4@example.com
 *         role: user
 *
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     tags: [Users]
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
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 *
 * /api/users/my-info:
 *   get:
 *     summary: Get my info
 *     description: Retrieve information about the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 *
 * /api/users/update:
 *   put:
 *     summary: Update my info
 *     description: Update information about the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 *
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User not authorized)
 *       500:
 *         description: Internal Server Error
 */

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/my-info", authenticate, getMyInfo);
router.put("/update", authenticate, updateUser);
router.put("/change-password", authenticate, changePassword);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

export default router;
