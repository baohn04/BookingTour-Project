import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import jwt from "jsonwebtoken";
import * as generateAuth from "../../../../helpers/generateAuth";
import md5 from "md5";
import ForgotPassword from "../../models/forgot-password.model";
import sendMail from "../../../../helpers/sendMail";

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken: string = req.body.token;

  if (!refreshToken) {
    res.status(401).json({
      message: "Token không tồn tại"
    });
    return;
  }

  const adminExist = await Admin.findOne({
    token: refreshToken,
    deleted: false
  });

  if (!adminExist) {
    res.status(401).json({
      message: "Token không hợp lệ"
    });
    return;
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(403).json({
        message: "Token đã hết hạn"
      });
      return;
    }

    const user = decoded as { id: string };
    const payload = { id: user.id };
    const accessToken: string = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" });
    res.status(200).json({
      message: "Refresh token thành công",
      accessToken: accessToken
    });
  });
};

// [POST] /api/v1/admin/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const admin = await Admin.findOne({
      email: email,
      deleted: false
    });

    if (!admin) {
      res.status(401).json({
        message: "Email không tồn tại"
      });
      return;
    }

    if (md5(password) !== admin.password) {
      res.status(401).json({
        message: "Sai mật khẩu"
      });
      return;
    }

    if (admin.status === "inactive") {
      res.status(401).json({
        message: "Tài khoản không hoạt động"
      });
      return;
    }

    // Tạo JWT với payload chứa id của admin
    const payload = { id: admin.id };

    const accessToken: string = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" });
    const refreshToken: string = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });

    // Lưu refreshToken vào DB
    await Admin.updateOne({ _id: admin.id }, { token: refreshToken });

    res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      userName: admin.fullName,
      email: admin.email,
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [POST] /api/v1/admin/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken: string = req.body.refreshToken;

  try {
    // Xóa refreshToken trong DB để vô hiệu hóa phiên đăng nhập
    if (refreshToken) {
      await Admin.updateOne({ token: refreshToken }, { token: "" });
    }

    res.status(200).json({
      code: 200,
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [POST] /api/v1/admin/auth/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;

    const admin = await Admin.findOne({
      email: email,
      deleted: false
    });

    if (!admin) {
      res.status(404).json({
        message: "Email không tồn tại"
      });
      return;
    }

    const otp: string = generateAuth.generateRandomNumber(6);
    const timeExpire: number = 3;

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject: string = "OTP Verification Code";
    const html: string = `
      Your OTP code is: <b>${otp}</b>. This code will expire in ${timeExpire} minutes.
    `;
    sendMail(email, subject, html);

    res.status(200).json({
      message: "OTP đã được gửi thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [POST] /api/v1/admin/auth/password/otp
export const otpPasswordPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;
    const otp: string = req.body.otp;

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });

    if (!result) {
      res.status(400).json({
        message: "OTP không hợp lệ"
      });
      return;
    }

    const admin = await Admin.findOne({
      email: email
    });

    if (!admin) {
      res.status(404).json({
        message: "Email không tồn tại"
      });
      return;
    }

    // const token = admin.token;

    res.status(200).json({
      message: "Xác thực OTP thành công",
      // token: token
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [POST] /api/v1/admin/auth/password/reset
export const resetPasswordPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const password: string = req.body.password;
    const confirmPassword: string = req.body.confirmPassword;
    const token: string = req.cookies.token || req.body.token;

    const admin = await Admin.findOne({
      token: token
    });

    if (!admin) {
      res.status(401).json({
        message: "Token không hợp lệ hoặc đã hết hạn"
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        message: "Mật khẩu không khớp"
      });
      return;
    }

    if (md5(password) === admin.password) {
      res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu cũ. Vui lòng nhập lại"
      });
      return;
    }

    await Admin.updateOne({
      token: token,
    }, {
      password: md5(password)
    });

    res.status(200).json({
      message: "Đặt lại mật khẩu thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};