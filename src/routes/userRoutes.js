import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { getMyInfo, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getUsers);
router.get("/my-info", authenticate, getMyInfo);

export default router;
