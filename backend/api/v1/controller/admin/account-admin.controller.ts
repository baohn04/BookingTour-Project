import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import md5 from "md5";
import * as generateAuth from "../../../../helpers/generateAuth";
import convertToSlug from "../../../../helpers/convertToSlug";
import filterStatusHelper from "../../../../helpers/filterStatus";
import paginationHelper from "../../../../helpers/pagination";

// Interfaces
interface AdminData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role_id: string;
  status: string;
  avatar?: string;
  token?: string;
}

// [GET] /admin/accounts-admin
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = {
      deleted: false
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

      // convert to slug Ex: Cắt Đôi --> Cat-Doi --> cat-doi
      const stringSlug = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");

      // key $or trong object find dùng để search theo title hoặc slug
      find["$or"] = [
        { fullName: keywordRegex },
        { slug: stringSlugRegex }
      ];
    }
    // End Search

    // Pagination
    const initPagination = {
      currentPage: 1,
      limitItems: 4,
    };

    const countTopics: number = await Admin.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countTopics);
    // End Pagination

    const records = await Admin.find(find)
      .select("-password -token")
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip || 0);

    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id,
        deleted: false
      });
      record["role"] = role;
    }

    res.status(200).json({
      message: "Get list accounts successfully!",
      data: records,
      filterStatus: filterStatus,
      keyword: keyword,
      pagination: objectPagination
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// [POST] /admin/accounts-admin/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const emailExist = await Admin.findOne({
      email: req.body.email,
      deleted: false
    });

    if (emailExist) {
      res.status(400).json({
        message: `Email ${req.body.email} already exists!`
      });
      return;
    }

    const dataAccount: AdminData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      phone: req.body.phone,
      role_id: req.body.role_id,
      status: req.body.status,
      token: generateAuth.generateRandomString(20)
    };

    if (req.body.avatar) {
      dataAccount.avatar = req.body.avatar;
    }

    const records = new Admin(dataAccount);
    await records.save();
    res.status(200).json({
      message: "Create account successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [GET] /admin/accounts-admin/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const data = await Admin.findOne({
      _id: id,
      deleted: false
    });

    if (!data) {
      res.status(404).json({
        message: "Not found account!"
      });
      return;
    }

    const roles = await Role.find({
      deleted: false
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [PATCH] /admin/accounts-admin/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const emailExist = await Admin.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });

    if (emailExist) {
      res.status(400).json({
        message: `Email ${req.body.email} already exists!`
      });
      return;
    }

    const dataAccount: AdminData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role_id: req.body.role_id,
      status: req.body.status
    };

    if (req.body.password) {
      dataAccount.password = md5(req.body.password);
    }

    if (req.body.avatar) {
      dataAccount.avatar = req.body.avatar;
    }

    await Admin.updateOne({ _id: id }, dataAccount);
    res.status(200).json({
      message: "Update account successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [DELETE] /admin/accounts-admin/delete/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Admin.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      message: "Delete account successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// [PATCH] /admin/accounts-admin/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Admin.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      message: "Change status successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};