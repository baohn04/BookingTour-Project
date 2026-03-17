import { Request, Response } from "express";
import Category from "../../models/category.model";
import filterStatusHelper from "../../../../helpers/filterStatus";
import convertToSlug from "../../../../helpers/convertToSlug";
import paginationHelper from "../../../../helpers/pagination";

// [GET] /admin/categories
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

    const countCategories: number = await Category.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countCategories
    );
    // End Pagination

    const categories = await Category.find(find)
      .sort(sort)
      .skip(objectPagination.skip || 0)
      .limit(objectPagination.limitItems);

    res.status(200).json({
      message: "Get list categories successfully!",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [POST] /admin/categories/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  interface CreateCategoryData {
    title: string;
    image?: string;
    description?: string;
    status: string;
    position: number;
  }

  try {
    const dataCategory: CreateCategoryData = {
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
      status: req.body.status,
      position: (await Category.countDocuments()) + 1,
    };

    const category = new Category(dataCategory);
    const data = await category.save();

    res.status(200).json({
      message: "Create category successfully!",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [PATCH] /admin/categories/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  interface EditCategoryData {
    title: string;
    image?: string;
    description: string;
    status: string;
    position: number;
  }

  const id: string = req.params.id;

  try {
    const dataCategory: EditCategoryData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      position: req.body.position,
    };

    if (req.body.image) {
      dataCategory["image"] = req.body.image;
    }

    await Category.updateOne(
      {
        _id: id,
      },
      dataCategory,
    );

    res.status(200).json({
      message: "Edit category successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [GET] /admin/categories/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const category = await Category.findOne({
      _id: id,
      deleted: false,
    });

    res.status(200).json({
      message: "Get detail category successfully!",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [DELETE] /admin/categories/delete/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Category.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      message: "Delete category successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [PATCH] /admin/categories/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Category.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      message: "Change status category successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};