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
    const sellerId = req.user.userId;

    const { productName, price, stockQuantity } = req.body;

    if (!productName || !price || !stockQuantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await prisma.product.create({
      data: {
        productName,
        price,
        stockQuantity,
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
