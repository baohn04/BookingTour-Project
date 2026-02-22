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

// Extend Request to include files (multiple upload)
interface RequestWithFiles extends Request {
  file?: MulterFile;
  files?: MulterFile[];
}

// Validate for create tour
export const createPost = (req: RequestWithFiles, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title (required)
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 255) {
    errors.push("Title must not exceed 255 characters");
  }

  // Validate code format (optional, but if provided must be valid)
  if (req.body.code && req.body.code.length > 50) {
    errors.push("Code must not exceed 50 characters");
  }

  // Validate price (required, must be positive number)
  if (!req.body.price || isNaN(Number(req.body.price))) {
    errors.push("Price is required and must be a valid number");
  } else if (Number(req.body.price) < 0) {
    errors.push("Price must not be negative");
  }

  // Validate discount (optional, 0-100)
  if (req.body.discount) {
    const discount = Number(req.body.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.push("Discount must be between 0 and 100");
    }
  }

  // Validate stock (optional, must be non-negative)
  if (req.body.stock) {
    const stock = Number(req.body.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push("Stock must not be negative");
    }
  }

  // Validate timeStart (optional, must be valid date if provided)
  if (req.body.timeStart) {
    const date = new Date(req.body.timeStart);
    if (isNaN(date.getTime())) {
      errors.push("Invalid start time format");
    }
  }

  // Validate position (optional, must be positive)
  if (req.body.position) {
    const position = Number(req.body.position);
    if (isNaN(position) || position < 1) {
      errors.push("Position must be a positive number");
    }
  }

  // Validate images if uploaded (multiple files)
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      // Check file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        errors.push(`Image "${file.originalname}" has invalid format. Allowed: JPG, PNG, GIF, WebP`);
      }

      // Check file size (2MB max)
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`Image "${file.originalname}" exceeds 2MB limit`);
      }
    }
  }

  // Validate single image if uploaded
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

// Validate for edit/update tour
export const editPatch = (req: RequestWithFiles, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title (required)
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 255) {
    errors.push("Title must not exceed 255 characters");
  }

  // Validate code format
  if (req.body.code && req.body.code.length > 50) {
    errors.push("Code must not exceed 50 characters");
  }

  // Validate price (required)
  if (!req.body.price || isNaN(Number(req.body.price))) {
    errors.push("Price is required and must be a valid number");
  } else if (Number(req.body.price) < 0) {
    errors.push("Price must not be negative");
  }

  // Validate discount (0-100)
  if (req.body.discount) {
    const discount = Number(req.body.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.push("Discount must be between 0 and 100");
    }
  }

  // Validate stock
  if (req.body.stock) {
    const stock = Number(req.body.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push("Stock must not be negative");
    }
  }

  // Validate timeStart
  if (req.body.timeStart) {
    const date = new Date(req.body.timeStart);
    if (isNaN(date.getTime())) {
      errors.push("Invalid start time format");
    }
  }

  // Validate position
  if (req.body.position) {
    const position = Number(req.body.position);
    if (isNaN(position) || position < 1) {
      errors.push("Position must be a positive number");
    }
  }

  // Validate images if uploaded (multiple files)
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        errors.push(`Image "${file.originalname}" has invalid format. Allowed: JPG, PNG, GIF, WebP`);
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`Image "${file.originalname}" exceeds 2MB limit`);
      }
    }
  }

  // Validate single image
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
