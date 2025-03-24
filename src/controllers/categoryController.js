import prisma from "../prisma/client.js";

export const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = await prisma.category.create({
      data: {
        categoryName: data.categoryName,
      },
    });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
