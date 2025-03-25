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

export const deleteCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty categoryIds array" });
    }

    const parsedCategoryIds = categoryIds
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (parsedCategoryIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid category IDs provided" });
    }

    const deleteResult = await prisma.category.deleteMany({
      where: { categoryId: { in: parsedCategoryIds } },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: "No matching categories found" });
    }

    res.status(200).json({
      message: `Successfully deleted ${deleteResult.count} categories`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
