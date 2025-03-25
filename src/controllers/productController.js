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
        productCategories: {
          select: {
            category: {
              select: {
                categoryName: true,
              },
            },
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      imageUrl: product.imageUrl,
      price: product.price,
      stockQuantity: product.stockQuantity,
      sellerId: product.sellerId,
      sellerName: product.seller?.name || "Unknown",
      categories: product.productCategories,
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
    // Validasi input menggunakan Zod
    const productSchema = z.object({
      productName: z.string().min(3),
      imageUrl: z.string().url().optional(),
      price: z.number().min(0),
      stockQuantity: z.number().min(0),
      categories: z.array(z.number().min(1)).optional(), // Array of category IDs
    });

    const sellerId = req.user.userId;

    // Parse data input
    const data = productSchema.parse(req.body);

    // Periksa apakah ada kategori yang dikirim
    let categoryRelations = [];
    if (data.categories && data.categories.length > 0) {
      // Ambil kategori yang valid dari database
      const existingCategories = await prisma.category.findMany({
        where: { categoryId: { in: data.categories } },
        select: { categoryId: true },
      });

      const validCategoryIds = existingCategories.map((c) => c.categoryId);

      // Jika ada kategori yang tidak valid, kembalikan error
      if (validCategoryIds.length !== data.categories.length) {
        return res.status(400).json({
          message: "One or more categories are invalid",
        });
      }

      // Siapkan data untuk tabel pivot ProductCategory
      categoryRelations = validCategoryIds.map((categoryId) => ({
        categoryId,
      }));
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Simpan produk baru
      const product = await prisma.product.create({
        data: {
          productName: data.productName,
          imageUrl: data.imageUrl || null,
          price: data.price,
          stockQuantity: data.stockQuantity,
          sellerId,
        },
      });

      // Simpan relasi kategori jika ada
      if (categoryRelations.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryRelations.map((rel) => ({
            productId: product.productId,
            categoryId: rel.categoryId,
          })),
        });
      }

      // Ambil kembali produk beserta kategori yang terkait
      const fullProduct = await prisma.product.findUnique({
        where: { productId: product.productId },
        include: {
          productCategories: {
            include: { category: true },
          },
        },
      });

      return fullProduct;
    });

    res.status(201).json({
      message: "Product created successfully",
      product: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error in postProduct",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // Validasi input menggunakan Zod
    const productSchema = z.object({
      productId: z.number().min(1),
      productName: z.string().min(3),
      price: z.number().min(0),
      stockQuantity: z.number().min(0),
      categories: z.array(z.number().min(1)).optional(), // Array of category IDs
    });

    // Parse data input
    const data = productSchema.parse(req.body);

    // Ambil gambar jika ada upload
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || null;

    // Cek apakah produk ada
    const existingProduct = await prisma.product.findUnique({
      where: { productId: data.productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Periksa kategori yang valid
    let categoryRelations = [];
    if (data.categories && data.categories.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { categoryId: { in: data.categories } },
        select: { categoryId: true },
      });

      const validCategoryIds = existingCategories.map((c) => c.categoryId);

      if (validCategoryIds.length !== data.categories.length) {
        return res.status(400).json({
          message: "One or more categories are invalid",
        });
      }

      categoryRelations = validCategoryIds.map((categoryId) => ({
        categoryId,
      }));
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Update produk
      const product = await prisma.product.update({
        where: { productId: data.productId },
        data: {
          productName: data.productName,
          imageUrl,
          price: data.price,
          stockQuantity: data.stockQuantity,
        },
      });

      // Hapus kategori lama
      await prisma.productCategory.deleteMany({
        where: { productId: data.productId },
      });

      // Tambah kategori baru jika ada
      if (categoryRelations.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryRelations.map((rel) => ({
            productId: product.productId,
            categoryId: rel.categoryId,
          })),
        });
      }

      // Ambil kembali data produk setelah update
      const fullProduct = await prisma.product.findUnique({
        where: { productId: product.productId },
        include: {
          productCategories: {
            include: { category: true },
          },
        },
      });

      return fullProduct;
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error in updateProduct",
      error: error.message,
    });
  }
};

export const deleteMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty productIds array" });
    }

    const parsedProductIds = productIds
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id));

    if (parsedProductIds.length === 0) {
      return res.status(400).json({ message: "No valid product IDs provided" });
    }

    const deleteResult = await prisma.product.deleteMany({
      where: { productId: { in: parsedProductIds } },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: "No matching products found" });
    }

    res.status(200).json({
      message: `Successfully deleted ${deleteResult.count} products`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error ketika menghapus produk",
      error: error.message,
    });
  }
};
