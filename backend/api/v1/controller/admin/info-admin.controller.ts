import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import { AuthRequest } from "../../types/express.d";

import md5 from "md5";

// [GET] /admin/info-admin/
export const index = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const role = await Role.findOne({ _id: user.role_id }).select("-__v -createdAt -updatedAt");

    res.status(200).json({
      userName: user.fullName,
      email: user.email,
      role: role,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};
// [PATCH] /admin/info-admin/edit
export const editPatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id: string = res.locals.user.id;

    interface IAccountData {
      fullName: string;
      email: string;
      password?: string;
      phone: string;
      avatar?: string;
    }

    const dataAccount: IAccountData = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone
    };

    if (req.body.password) {
      dataAccount.password = md5(req.body.password);
    }

    if (req.body.avatar) {
      dataAccount.avatar = req.body.avatar;
    }

    await Admin.updateOne({ _id: id }, dataAccount);
    res.status(200).json({
      message: "Đã cập nhật thông tin",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    });
  }
};