import { NextFunction, Request, Response } from "express";

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allowed image formats
const ALLOWED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp"
];

// Max file size: 2MB in bytes
const MAX_FILE_SIZE: number = 2 * 1024 * 1024;

// Interface for Multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

// Extend Request to include file
interface RequestWithFile extends Request {
  file?: MulterFile;
}

// Validate for create admin account
export const createPost = (req: RequestWithFile, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate fullName
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

  // Validate password required
  if (!req.body.password || req.body.password.trim() === "") {
    errors.push("Password is required");
  } else if (req.body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  // Validate phone (optional, but if provided must be valid)
  if (req.body.phone && !/^[0-9]{10,11}$/.test(req.body.phone)) {
    errors.push("Invalid phone number (10-11 digits required)");
  }

  // Validate avatar if uploaded
  if (req.file) {
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      errors.push("Invalid image format. Allowed: JPG, PNG, GIF, WebP");
    }
    if (req.file.size > MAX_FILE_SIZE) {
      errors.push("Image size must not exceed 2MB");
    }
  }

  // Validate status
  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
    errors.push("Invalid status. Allowed: active, inactive");
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

// Validate for edit/update admin account
export const editPatch = (req: RequestWithFile, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate fullName
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

  // Validate password length (only if password is provided)
  if (req.body.password && req.body.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  // Validate phone (optional)
  if (req.body.phone && !/^[0-9]{10,11}$/.test(req.body.phone)) {
    errors.push("Invalid phone number (10-11 digits required)");
  }

  // Validate avatar if uploaded
  if (req.file) {
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      errors.push("Invalid image format. Allowed: JPG, PNG, GIF, WebP");
    }
    if (req.file.size > MAX_FILE_SIZE) {
      errors.push("Image size must not exceed 2MB");
    }
  }

  // Validate status
  if (req.body.status && !["active", "inactive"].includes(req.body.status)) {
    errors.push("Invalid status. Allowed: active, inactive");
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