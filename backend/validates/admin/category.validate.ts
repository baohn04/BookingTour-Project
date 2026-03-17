import { NextFunction, Request, Response } from "express";

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

export const createPost = (req: RequestWithFile, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 50) {
    errors.push("Title must not exceed 50 characters");
  }

  // Validate image if uploaded
  if (req.file) {
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      errors.push("Invalid image format. Allowed: JPG, PNG, GIF, WebP");
    }

    // Check file size (2MB max)
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

// Validate for update/edit
export const editPatch = (req: RequestWithFile, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 200) {
    errors.push("Title must not exceed 200 characters");
  }

  // Validate image if uploaded
  if (req.file) {
    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
      errors.push("Invalid image format. Allowed: JPG, PNG, GIF, WebP");
    }

    // Check file size (2MB max)
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