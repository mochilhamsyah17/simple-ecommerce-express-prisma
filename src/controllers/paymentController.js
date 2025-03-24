import prisma from "../prisma/client.js";

export const createPayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: orderId },
    });

    if (existingPayment) {
      return res.status(400).json({ message: "Payment already exists" });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: orderId,
        paymentDate: new Date(),
        paymentStatus: true,
      },
    });

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
