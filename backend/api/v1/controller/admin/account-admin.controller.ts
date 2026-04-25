import { permissions } from './role.controller';
import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import md5 from "md5";
import convertToSlug from "../../../../helpers/convertToSlug";
import filterStatusHelper from "../../../../helpers/filterStatus";
import paginationHelper from "../../../../helpers/pagination";
import { BaseAdmin } from "../../interfaces/admin.interface";

// [GET] /admin/accounts-admin
export const index = async (req: Request, res: Response): Promise<void> => {
  interface AdminSearchQuery {
    deleted: boolean;
    status?: string;
    $or?: Array<{ fullName: RegExp } | { slug: RegExp }>;
  }

  interface AdminResponse extends BaseAdmin {
    role?: {
      _id: string,
      title: string,
      description: string,
      permissions: string[]
    }
  }

  try {
    const find: AdminSearchQuery = {
      deleted: false,
    };

    // Filter Status
    const filterStatus = filterStatusHelper(req.query);

    if (req.query.status) {
      find.status = req.query.status.toString();
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
      find.$or = [{ fullName: keywordRegex }, { slug: stringSlugRegex }];
    }
    // End Search

    // Pagination
    const initPagination = {
      currentPage: 1,
      limitItems: 4,
    };

    const countTopics: number = await Admin.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countTopics,
    );
    // End Pagination

    const records = await Admin.find(find)
      .select("-password -token")
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip || 0)
      .lean() as AdminResponse[];

    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id,
        deleted: false,
      }).select("-__v -createdAt -updatedAt").lean();
      if (role) {
        record.role = {
          _id: role._id.toString(),
          title: role.title,
          description: role.description,
          permissions: role.permissions
        };
      }
    }

    res.status(200).json({
      message: "Lấy danh sách tài khoản thành công",
      data: records,
      filterStatus: filterStatus,
      keyword: keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};

// [GET] /admin/accounts-admin/create
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.find({
      deleted: false,
    });

    res.status(200).json({
      message: "Lấy danh sách quyền thành công",
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};

// [POST] /admin/accounts-admin/create
export const createPost = async (req: Request, res: Response,): Promise<void> => {
  interface CreateAdminData {
    fullName: string;
    email: string;
    password?: string;
    phone: string;
    role_id: string;
    status: string;
    avatar?: string;
    token?: string;
  }

  try {
    const emailExist = await Admin.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.status(400).json({
        message: `Email ${req.body.email} đã tồn tại`,
      });
      return;
    }

    const dataAccount: CreateAdminData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      phone: req.body.phone,
      role_id: req.body.role_id,
      status: req.body.status,
    };

    if (req.body.avatar) {
      dataAccount.avatar = req.body.avatar;
    }

    const records = new Admin(dataAccount);
    await records.save();
    res.status(200).json({
      message: "Tạo tài khoản thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};

// [GET] /admin/accounts-admin/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    const data = await Admin.findOne({
      _id: id,
      deleted: false,
    });

    if (!data) {
      res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
      return;
    }

    const roles = await Role.find({
      deleted: false,
    });

    res.status(200).json({
      message: "Lấy chi tiết tài khoản thành công",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};

// [PATCH] /admin/accounts-admin/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  interface EditAdminData {
    fullName: string;
    email: string;
    password?: string;
    phone: string;
    role_id: string;
    status: string;
    avatar?: string;
    token?: string;
  }

  try {
    const id: string = req.params.id;

    const emailExist = await Admin.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      res.status(400).json({
        message: `Email ${req.body.email} đã tồn tại`,
      });
      return;
    }

    const dataAccount: EditAdminData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      role_id: req.body.role_id,
      status: req.body.status,
    };

    if (req.body.password) {
      dataAccount.password = md5(req.body.password);
    }

    if (req.body.avatar) {
      dataAccount.avatar = req.body.avatar;
    }

    await Admin.updateOne({ _id: id }, dataAccount);
    res.status(200).json({
      message: "Cập nhật tài khoản thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
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
        deletedAt: new Date(),
      },
    );

    res.status(200).json({
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
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
      message: "Thay đổi trạng thái thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};
