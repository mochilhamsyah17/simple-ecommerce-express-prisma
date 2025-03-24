import { z } from "zod";
import prisma from "../prisma/client.js";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      stockQuantity: product.stockQuantity,
      sellerId: product.sellerId,
      sellerName: product.seller?.name || "Unknown", // Jika seller tidak ditemukan
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const postProduct = async (req, res) => {
  try {
    const productSchema = z.object({
      productName: z.string().min(3),
      price: z.number().min(0),
      stockQuantity: z.number().min(0),
    });

    const sellerId = req.user.userId;

    const data = productSchema.parse(req.body);

    if (!data.productName || !data.price || !data.stockQuantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await prisma.product.create({
      data: {
        productName: data.productName,
        price: data.price,
        stockQuantity: data.stockQuantity,
        sellerId,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error in postProduct",
      error: error.message,
    });
  }
};
