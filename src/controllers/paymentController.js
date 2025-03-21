import prisma from "../prisma/client.js";

export const createPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.create({
      data: {
        orderId: req.body.orderId,
        paymentDate: new Date(),
        paymentStatus: req.body.paymentStatus,
      },
      include: {
        order: true,
      },
    });

    res.json(payment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
