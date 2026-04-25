import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if(!mongoUrl) {
      throw new Error("Chưa cấu hình đến MongoDB")
    }
    await mongoose.connect(mongoUrl);
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error!");
  }
}