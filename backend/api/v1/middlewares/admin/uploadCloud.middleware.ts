import { Request, Response, NextFunction } from "express";
import uploadToCloudinary from "../../../../helpers/uploadToCloudinary";

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface RequestWithFile extends Request {
  file?: MulterFile;
}

export interface RequestWithFields extends Request {
  files?: {
    [fieldname: string]: MulterFile[];
  };
}

export interface RequestWithFileArray extends Request {
  files?: MulterFile[];
}


export const uploadSingle = async (req: RequestWithFile, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.file) { // Không cần dùng req["file"] nữa
      const result = await uploadToCloudinary(req.file.buffer);
      req.body[req.file.fieldname] = result;
    }
  } catch (error) {
    console.error("Lỗi uploadSingle:", error);
  }

  next();
};

export const uploadFields = async (req: RequestWithFields, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.files) {
      for (const key in req.files) {
        req.body[key] = [];

        const array = req.files[key];
        for (const item of array) {
          const result = await uploadToCloudinary(item.buffer);
          req.body[key].push(result);
        }
      }
    }
  } catch (error) {
    console.error("Lỗi uploadFields:", error);
  }

  next();
};

export const uploadArray = async (req: RequestWithFileArray, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const fieldname = req.files[0].fieldname;
      req.body[fieldname] = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        req.body[fieldname].push(result);
      }
    }
  } catch (error) {
    console.error("Lỗi uploadArray:", error);
  }

  next();
};