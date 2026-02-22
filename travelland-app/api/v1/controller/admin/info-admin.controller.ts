import { Request, Response } from "express";
import Admin from "../../models/admin.model";

import md5 from "md5";

// [PATCH] /admin/info-admin/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = res.locals.user.id;

    interface dataAcount {
      fullName: string,
      email: string,
      password?: string,
      phone: string,
      avatar?: string,
    };

    const dataAcount: dataAcount = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone
    };

    if (req.body.password) {
      dataAcount["password"] = md5(req.body.password);
    }

    if (req.body.avatar) {
      dataAcount["avatar"] = req.body.avatar;
    }

    await Admin.updateOne({ _id: id }, dataAcount);
    res.status(200).json({
      message: "Update account successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};