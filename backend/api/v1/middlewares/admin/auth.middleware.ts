import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../../models/admin.model";
import Role from "../../models/role.model";
import { AuthRequest } from "../../types/express.d";

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Lấy token từ Header Authorization (format: "Bearer <token>")
    const token: string | undefined = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Vui lòng đăng nhập"
      });
      return;
    }

    // Verify JWT - nếu token sai hoặc hết hạn sẽ throw error
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { id: string };

    // Tìm admin dựa trên id được giải mã từ JWT
    const user = await Admin.findOne({
      _id: decoded.id,
      deleted: false,
    }).select("-password");

    if (!user) {
      res.status(401).json({
        message: "Tài khoản không tồn tại"
      });
      return;
    }

    if (user.status === "inactive") {
      res.status(401).json({
        message: "Tài khoản không hoạt động"
      });
      return;
    }

    // Tìm role của admin
    let role: Record<string, any> = { permissions: [] };
    if (user.role_id) {
      const foundRole = await Role.findOne({
        _id: user.role_id,
        deleted: false
      });
      if (foundRole) {
        role = foundRole;
      }
    }

    // Gán thông tin vào request để các controller phía sau sử dụng
    req.user = user;
    req.role = role;

    next();
  } catch (error) {
    // jwt.verify sẽ throw error nếu token không hợp lệ hoặc hết hạn
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token đã hết hạn, vui lòng đăng nhập lại"
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        message: "Token không hợp lệ"
      });
      return;
    }

    res.status(500).json({
      message: "Lỗi xác thực",
      error: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};
