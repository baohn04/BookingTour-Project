import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import Review from "../../models/review.model";
import { BaseTour, TourResponse } from "../../interfaces/tour.interface";
import convertToSlug from "../../../../helpers/convertToSlug";

// ── Search Query Interface ────────────────────────────────────────────────────
interface TourSearchQuery {
  keyword?: string;
  timeStart?: string;    // ISO date string – lower bound
  timeEnd?: string;      // ISO date string – upper bound
  categoryId?: string;
  sortKey?: string;
  sortValue?: string;
}

interface TourIndexParams {
  slugCategory: string;
}

interface TourIndexQuery {
  sortKey?: string;
  sortValue?: string;
}

// [GET] /tours/:slugCategory
export const index = async (req: Request<TourIndexParams, any, any, TourIndexQuery>, res: Response): Promise<void> => {
  try {
    const slugCategory = req.params.slugCategory;

    const category = await Category.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    }).select("-__v -createdAt -updatedAt");

    let tours: any[] = [];

    if (category) {
      const categoryId = category.id;

      let find = {
        category_ids: categoryId,
        deleted: false,
        status: "active"
      };

      const sort: Record<string, any> = {};
      if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
      } else {
        sort.position = "desc";
      }

      tours = await Tour.find(find)
        .select("-__v -createdAt -updatedAt")
        .sort(sort)
        .lean();

      for (const tour of tours) {
        if (tour.price) {
          tour.price_special = tour.price * (1 - tour.discount / 100);
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
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
}

export interface TourDetailParams {
  slugTour: string;
}

// [GET] /tours/detail/:slugTour
export const detail = async (req: Request<TourDetailParams>, res: Response): Promise<void> => {
  try {
    const slugTour = req.params.slugTour;

    const tourDetail = await Tour.findOne({
      slug: slugTour,
      deleted: false,
      status: "active"
    }).select("-__v -createdAt -updatedAt").lean() as TourResponse;

    if (!tourDetail) {
      res.status(404).json({
        message: "Tour không tồn tại"
      });
      return;
    }

    tourDetail.price_special = tourDetail.price * (1 - tourDetail.discount / 100);

    res.status(200).json({
      message: "Success",
      data: tourDetail
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
}

export interface TourReviewQuery {
  tourId?: string;
  limit?: string;
  skip?: string;
}

// [GET] /tours/review
export const review = async (req: Request<{}, any, any, TourReviewQuery>, res: Response): Promise<void> => {
  try {
    const tourId = req.query.tourId;

    if (!tourId) {
      res.status(400).json({ message: "tourId là bắt buộc!" });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const skip = parseInt(req.query.skip as string) || 0;

    const totalReviews = await Review.countDocuments({
      tourId: tourId,
      deleted: false
    });

    const reviews = await Review.find({
      tourId: tourId,
      deleted: false
    }).sort({ createdAt: "desc" }).skip(skip).limit(limit).lean();

    res.status(200).json({
      message: "Success",
      data: reviews,
      totalReviews: totalReviews
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
}

export interface TourReviewPostBody {
  name: string;
  email: string;
  comment: string;
  rating: number;
  tourId: string;
}

// [POST] /tour/review
export const reviewPost = async (req: Request<{}, any, TourReviewPostBody>, res: Response): Promise<void> => {
  try {
    const { name, email, comment, rating, tourId } = req.body;

    const review = await Review.findOneAndUpdate(
      { email: email, tourId: tourId },
      { name, email, comment, rating, tourId },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Đã gửi đánh giá thành công!",
      data: {
        review: review
      }
    })
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    })
  }
}

// [GET] /tours/search
export const search = async (req: Request<{}, any, any, TourSearchQuery>, res: Response): Promise<void> => {
  try {
    const { keyword, timeStart, timeEnd, categoryId, sortKey, sortValue } = req.query;

    const find: Record<string, any> = {
      deleted: false,
      status: "active",
    };

    if (keyword && keyword.trim() !== "") {
      const keywordRegex = new RegExp(keyword.trim(), "i");
      const slugRegex = new RegExp(convertToSlug(keyword.trim()), "i");
      find.$or = [{ title: keywordRegex }, { slug: slugRegex }];
    }

    if (timeStart || timeEnd) {
      find.timeStart = {};
      if (timeStart) {
        find.timeStart.$gte = new Date(timeStart);
      }
      if (timeEnd) {
        find.timeStart.$lte = new Date(timeEnd);
      }
    }

    if (categoryId && categoryId !== "all") {
      find.category_ids = categoryId;
    }
    const sort: Record<string, any> = {};
    if (sortKey && sortValue) {
      sort[sortKey] = sortValue;
    } else {
      sort.position = "desc";
    }

    const tours = await Tour.find(find)
      .sort(sort)
      .select("-__v -createdAt -updatedAt")
      .lean();

    tours.forEach((tour: any) => {
      if (tour.price && tour.discount !== undefined) {
        tour.price_special = tour.price * (1 - tour.discount / 100);
      }
    });

    res.status(200).json({
      message: "Success",
      data: tours,
      total: tours.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};