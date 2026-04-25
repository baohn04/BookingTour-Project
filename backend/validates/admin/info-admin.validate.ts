import { NextFunction, Request, Response } from "express";

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate for edit personal info
export const editPatch = (req: Request, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate fullName required
  if (!req.body.fullName || req.body.fullName.trim() === "") {
    errors.push("Full name is required");
  } else if (req.body.fullName.length > 100) {
    errors.push("Full name must not exceed 100 characters");
  }

  // Validate email required
  if (!req.body.email || req.body.email.trim() === "") {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(req.body.email)) {
    errors.push("Invalid email format");
  }

  // Validate password match (only when password is provided)
  if (req.body.password) {
    // Validate password length
    if (req.body.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    // Validate confirm password
    if (req.body.password !== req.body.confirmPassword) {
      errors.push("Passwords do not match");
    }
  }

  // Validate phone (optional)
  if (req.body.phone && !/^[0-9]{10,11}$/.test(req.body.phone)) {
    errors.push("Invalid phone number (10-11 digits required)");
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