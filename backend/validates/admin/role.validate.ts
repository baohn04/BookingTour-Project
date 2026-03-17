import { NextFunction, Request, Response } from "express";

// Validate for create role
export const createPost = (req: Request, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title required
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 100) {
    errors.push("Title must not exceed 100 characters");
  }

  // Validate description required
  if (!req.body.description || req.body.description.trim() === "") {
    errors.push("Description is required");
  } else if (req.body.description.length > 500) {
    errors.push("Description must not exceed 500 characters");
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

// Validate for edit/update role
export const editPatch = (req: Request, res: Response, next: NextFunction): void => {
  const errors: string[] = [];

  // Validate title required
  if (!req.body.title || req.body.title.trim() === "") {
    errors.push("Title is required");
  } else if (req.body.title.length > 100) {
    errors.push("Title must not exceed 100 characters");
  }

  // Validate description required
  if (!req.body.description || req.body.description.trim() === "") {
    errors.push("Description is required");
  } else if (req.body.description.length > 500) {
    errors.push("Description must not exceed 500 characters");
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