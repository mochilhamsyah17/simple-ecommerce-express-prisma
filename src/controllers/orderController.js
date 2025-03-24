import prisma from "../prisma/client.js";

export const createOrder = async (req, res) => {
  const userId = req.user?.userId;
  const { items } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  try {
    // Ambil informasi produk yang dipesan
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { productId: { in: productIds } },
    });

    if (products.length !== items.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    // Validasi stok & hitung total harga
    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.productId === item.productId);
      if (!product)
        throw new Error(`Product with ID ${item.productId} not found`);
      if (product.stockQuantity < item.quantity)
        throw new Error(`Not enough stock for product ${product.productName}`);

      totalAmount += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    // Buat order dengan relasi ke User
    const order = await prisma.order.create({
      data: {
        userId,
        orderDate: new Date(),
        totalAmount,
        orderItems: { create: orderItems },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    // Kurangi stok produk yang dipesan
    await Promise.all(
      items.map((item) =>
        prisma.product.update({
          where: { productId: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        })
      )
    );

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
    });
    res.json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getOrderByUser = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { Product: true },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
