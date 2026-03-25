import { Request, Response } from "express";
import Admin from "../../models/admin.model";
import * as generateAuth from "../../../../helpers/generateAuth";
import md5 from "md5";
import ForgotPassword from "../../models/forgot-password.model";
import sendMail from "../../../../helpers/sendMail";

// [POST] /api/v1/admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
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

    const token = admin.token;

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [POST] /api/v1/admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Đăng xuất thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [POST] /api/v1/admin/auth/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

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

    const otp = generateAuth.generateRandomNumber(6);
    const timeExpire = 3;

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = "OTP Verification Code";
    const html = `
      Your OTP code is: <b>${otp}</b>. This code will expire in ${timeExpire} minutes.
    `;
    sendMail(email, subject, html);

    res.status(200).json({
      message: "OTP đã được gửi thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [POST] /api/v1/admin/auth/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

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

    const token = admin.token;

    res.status(200).json({
      message: "Xác thực OTP thành công",
      token: token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [POST] /api/v1/admin/auth/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.cookies.token || req.body.token;

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
      message: error.message
    });
  }
};