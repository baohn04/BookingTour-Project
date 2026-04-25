import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// End Configuration

const streamUpload = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 3. Khai báo hàm này sẽ trả về một chuỗi (URL của ảnh)
const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  const result = await streamUpload(buffer);
  return result.secure_url || result.url;
};

export default uploadToCloudinary;