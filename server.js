import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import protectedRoutes from "./src/routes/protectedRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import swaggerSetup from "./swagger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Express Auth API" });
});

swaggerSetup(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
