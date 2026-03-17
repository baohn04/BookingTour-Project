import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";

// [GET] /tours/:slugCategory
export const index = async (req: Request, res: Response) => {
  try {
    const slugCategory = req.params.slugCategory;

    const category = await Category.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    }).select("-__v -createdAt -updatedAt");

    let tours = [];

    if (category) {
      const categoryId = category.id;

      let find = {
        category_ids: categoryId,
        deleted: false,
        status: "active"
      };

      const sort = {};
      if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue.toString();
      } else {
        sort["position"] = "desc";
      }

      tours = await Tour.find(find)
        .select("-__v -createdAt -updatedAt")
        .sort(sort)
        .lean();

      for (const tour of tours) {
        if (tour.price) {
          tour["price_special"] = tour.price * (1 - tour.discount / 100);
        }
      }
    }

    res.status(200).json({
      message: "Success",
      data: tours,
      infoCategory: category
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// [GET] /tours/detail/:slugTour
export const detail = async (req: Request, res: Response) => {
  try {
    const slugTour = req.params.slugTour;

    const tourDetail = await Tour.findOne({
      slug: slugTour,
      deleted: false,
      status: "active"
    }).select("-__v -createdAt -updatedAt").lean();

    tourDetail["price_special"] = tourDetail.price * (1 - tourDetail.discount / 100);

    res.status(200).json({
      message: "Success",
      data: tourDetail
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}