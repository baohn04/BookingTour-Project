import { Request, Response } from "express";

// [GET] /admin/error/404
export const notFound = async (req: Request, res: Response) => {
  res.status(404).json({
    message: "404 Not Found",
  });
}