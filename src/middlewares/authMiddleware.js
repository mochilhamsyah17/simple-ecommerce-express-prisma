import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "invalid token",
    });
  }
};

export const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden", role: req.user.role });
    }

    next();
  };
};
