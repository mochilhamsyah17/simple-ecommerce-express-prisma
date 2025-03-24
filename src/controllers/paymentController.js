import prisma from "../prisma/client.js";

export const createPayment = async (req, res) => {
  const { orderId, paymentStatus } = req.body;
  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: req.body.orderId,
        paymentDate: new Date(),
        paymentStatus: req.body.paymentStatus,
      },
    });

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
