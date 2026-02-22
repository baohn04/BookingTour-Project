import { Request, Response } from "express";
import Category from "../../models/category.model";
import filterStatusHelper from "../../../../helpers/filterStatus";
import convertToSlug from "../../../../helpers/convertToSlug";
import paginationHelper from "../../../../helpers/pagination";
import Tour from "../../models/tour.model";
import { generateTourCode } from "../../../../helpers/generate";

// [GET] /admin/tours
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = {
      deleted: false,
    };

    // Filter Status
    const filterStatus = filterStatusHelper(req.query);

    if (req.query.status) {
      find["status"] = req.query.status.toString();
    }
    // End Filter Status

    // Search
    const keyword: string = (req.query.keyword as string) || "";

    if (keyword && keyword !== "undefined") {
      const keywordRegex = new RegExp(keyword, "i");

      const stringSlug = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");

      find["$or"] = [{ title: keywordRegex }, { slug: stringSlugRegex }];
    }
    // End Search

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      sort[sortKey] = req.query.sortValue.toString();
    } else {
      sort["position"] = "desc";
    }
    // End Sort

    // Pagination
    const initPagination = {
      currentPage: 1,
      limitItems: 5,
    };

    const countTours: number = await Tour.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countTours
    );
    // End Pagination

    const tours = await Tour.find(find)
      .sort(sort)
      .skip(objectPagination.skip || 0)
      .limit(objectPagination.limitItems).lean();

    // Price discount
    tours.forEach((item) => {
      if (item.price && item.discount) {
        item["price_special"] = item.price * (1 - item.discount / 100);
      }
    });

    res.status(200).json({
      message: "Get list tours successfully!",
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [GET] /admin/tours/create
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({
      deleted: false,
      status: "active"
    }).select("_id title slug");

    res.status(200).json({
      message: "Get categories for create tour successfully!",
      data: {
        categories: categories
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [POST] /admin/tours/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  interface CreateTourData {
    title: string;
    code: string;
    images: string[];
    price: number;
    discount: number;
    stock: number;
    timeStart: string | null;
    information: string;
    schedule: string;
    status: string;
    position: number;
    category_ids: string[];
  }

  try {
    const countTour: number = await Tour.countDocuments();
    const code: string = generateTourCode(countTour + 1);

    if (req.body.position === "") {
      req.body.position = countTour + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    let categoryIds: string[] = [];
    if (req.body.category_ids) {
      if (Array.isArray(req.body.category_ids)) {
        categoryIds = req.body.category_ids;
      } else if (typeof req.body.category_ids === 'string') {
        categoryIds = req.body.category_ids.split(',').map((id: string) => id.trim()).filter((id: string) => id !== '');
      }
    }

    const dataTour: CreateTourData = {
      title: req.body.title,
      code: code,
      images: req.body.images,
      price: parseInt(req.body.price),
      discount: parseInt(req.body.discount),
      stock: parseInt(req.body.stock),
      timeStart: req.body.timeStart,
      information: req.body.information,
      schedule: req.body.schedule,
      status: req.body.status,
      position: req.body.position,
      category_ids: categoryIds
    };

    const tour = new Tour(dataTour);
    const data = await tour.save();

    res.status(200).json({
      message: "Create tour successfully!",
      data: data,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// [GET] /admin/tours/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const tour = await Tour.findOne({
      _id: id,
      deleted: false
    });

    const categories = await Category.find({
      deleted: false,
      status: "active"
    }).select("_id title slug");

    res.status(200).json({
      message: "Get categories for edit tour successfully!",
      data: {
        categories: categories,
        tour: tour
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// [PATCH] /admin/tours/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  interface EditTourData {
    title: string;
    code: string;
    images?: string[];
    price: number;
    discount: number;
    stock: number;
    timeStart: string | null;
    information: string;
    schedule: string;
    status: string;
    position: number;
    category_ids: string[];
  }

  const id: string = req.params.id;

  try {
    let finalImages: string[] = [];

    if (req.body.existingImages) {
      const existingImages = req.body.existingImages
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url !== '');
      finalImages = [...existingImages];
    }

    if (req.body.images && Array.isArray(req.body.images)) {
      finalImages = [...finalImages, ...req.body.images];
    } else if (req.body.images && typeof req.body.images === 'string') {
      finalImages.push(req.body.images);
    }

    let categoryIds: string[] = [];
    if (req.body.category_ids) {
      if (Array.isArray(req.body.category_ids)) {
        categoryIds = req.body.category_ids;
      } else if (typeof req.body.category_ids === 'string') {
        categoryIds = req.body.category_ids.split(',').map((id: string) => id.trim()).filter((id: string) => id !== '');
      }
    }

    const dataTour: EditTourData = {
      title: req.body.title,
      code: req.body.code,
      images: finalImages,
      price: parseInt(req.body.price),
      discount: parseInt(req.body.discount),
      stock: parseInt(req.body.stock),
      timeStart: req.body.timeStart,
      information: req.body.information,
      schedule: req.body.schedule,
      status: req.body.status,
      position: parseInt(req.body.position),
      category_ids: categoryIds,
    };

    // Cập nhật tour
    await Tour.updateOne({ _id: id }, dataTour);

    res.status(200).json({
      message: "Update tour successfully!",
      data: dataTour,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [GET] /admin/tours/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const tour = await Tour.findOne({
      _id: id,
      deleted: false,
    });

    res.status(200).json({
      message: "Get detail tour successfully!",
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [DELETE] /admin/tours/delete/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const result = await Tour.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.status(200).json({
      message: "Delete tour successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [PATCH] /admin/tours/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;
    const status: string = req.params.status;

    await Tour.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      message: "Change status tour successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};