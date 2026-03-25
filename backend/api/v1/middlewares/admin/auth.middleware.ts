import { Request, Response, NextFunction } from "express";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const user = await Admin.findOne({
        token: token,
        deleted: false,
      }).select("-password");

      if (!user) {
        res.status(401).json({
          message: "Token không hợp lệ"
        });
        return;
      }

      if (user.status === "inactive") {
        res.status(401).json({
          message: "Tài khoản không hoạt động"
        });
        return;
      }

      let role: any = { permissions: [] };
      if (user.role_id) {
        const foundRole = await Role.findOne({
          _id: user.role_id,
          deleted: false
        });
        if (foundRole) {
          role = foundRole;
        }
      }

      (req as any).user = user;
      (req as any).role = role;

      next();
    } else {
      res.status(401).json({
        message: "Vui lòng đính kèm token trong header"
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi xác thực",
      error: error.message
    });
  }
};
