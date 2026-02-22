import { Request, Response } from "express";
import Category from "../../models/category.model";

// [GET] /api/v1/categories
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({
      deleted: false,
      status: "active"
    }).select("-__v -createdAt -updatedAt");

    res.status(200).json({
      message: "Success",
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};