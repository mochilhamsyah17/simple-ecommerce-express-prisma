import { z } from "zod";
import prisma from "../prisma/client.js";
import { compare, hash } from "bcryptjs";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
});
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMyInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = userSchema.parse(req.body);
    const userId = req.user?.userId;
    if (!userId)
      return res.status(401).json({ message: "Unauthorized: User not found" });

    if (!data.name?.trim() && !data.email?.trim() && !data.role?.trim()) {
      return res
        .status(400)
        .json({ message: "at least one field is required" });
    }

    // cek apakah email sudah digunakan oleh user lain
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name?.trim() || undefined,
        email: data.email?.trim() || undefined,
        role: data.role?.trim() || undefined,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.user?.userId;
  const targetUserId = parseInt(req.params.id, 10); // Pastikan ID berupa angka

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not found" });
  }

  if (userId === targetUserId) {
    return res.status(400).json({ message: "You cannot delete yourself" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  try {
    // Cek apakah user dengan ID tersebut ada
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const validationSchema = z.object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    });

    const parsedData = validationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ message: "Invalid request data", error: parsedData.error });
    }

    const { oldPassword, newPassword } = parsedData.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
