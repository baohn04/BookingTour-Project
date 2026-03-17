import { Request, Response } from "express";
import Category from "../../models/category.model";
import Tour from "../../models/tour.model";

// [GET] /
export const home = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({
      deleted: false,
      status: "active"
    }).lean();

    const featuredTours = await Tour.find({
      deleted: false,
      status: "active"
    }).sort({ discount: "desc" }).limit(8).select("-__v -createdAt -updatedAt").lean();

    for (const tour of featuredTours) {
      if (tour.images.length > 0) {
        tour["image"] = tour.images[0];
      }
      if (tour.price) {
        tour["price_special"] = tour.price * (1 - tour.discount / 100);
      }
    }

    res.status(200).json({
      message: "Success",
      data: {
        categories: categories,
        featuredTours: featuredTours
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}