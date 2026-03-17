import { NextFunction, Request, Response } from "express";

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate for edit personal info
export const editPatch = (req: Request, res: Response, next: NextFunction): void => {
  // Validate fullName required
  if (!req.body.fullName || req.body.fullName.trim() === "") {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Validate fullName length
  if (req.body.fullName.length > 100) {
    req.flash("error", "Họ tên không được quá 100 ký tự!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Validate email required
  if (!req.body.email || req.body.email.trim() === "") {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Validate email format
  if (!EMAIL_REGEX.test(req.body.email)) {
    req.flash("error", "Email không đúng định dạng!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  // Validate password match (only when password is provided)
  if (req.body.password) {
    // Validate password length
    if (req.body.password.length < 6) {
      req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự!");
      res.redirect(req.get("Referrer") || "/");
      return;
    }

    // Validate confirm password
    if (req.body.password !== req.body.confirmPassword) {
      req.flash("error", "Mật khẩu xác nhận không trùng khớp!");
      res.redirect(req.get("Referrer") || "/");
      return;
    }
  }

  // Validate phone (optional)
  if (req.body.phone && !/^[0-9]{10,11}$/.test(req.body.phone)) {
    req.flash("error", "Số điện thoại không hợp lệ (10-11 số)!");
    res.redirect(req.get("Referrer") || "/");
    return;
  }

  next();
};