import { NextFunction, Request, Response } from "express";

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.body.email) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(req.body.email)) {
    errors.push("Invalid email format");
  }

  if (!req.body.password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
    return;
  }

  next();
};

export const forgotPasswordPost = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.body.email) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(req.body.email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
    return;
  }

  next();
};

export const otpPasswordPost = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.body.email) {
    errors.push("Email is required");
  }

  if (!req.body.otp) {
    errors.push("OTP is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
    return;
  }

  next();
};

export const resetPasswordPost = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.body.password) {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!req.body.confirmPassword) {
    errors.push("Confirm password is required");
  }

  if (req.body.password && req.body.confirmPassword && req.body.password !== req.body.confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: "Validation failed",
      errors: errors
    });
    return;
  }

  next();
};