import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/user", authenticate, (req, res) => {
  res.json({
    message: "welcome user",
    user: req.user,
  });
});

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({
    message: "welcome admin",
    user: req.user,
  });
});

export default router;
