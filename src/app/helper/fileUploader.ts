import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import path from "path";
import { ENV } from "../config/env";
import { AppError } from "../utils/appError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadCloudinary = async (file: Express.Multer.File) => {
  console.log("From File Uploader => ", file);

  // Configuration
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY.CLOUD_NAME,
    api_key: ENV.CLOUDINARY.API_KEY,
    api_secret: ENV.CLOUDINARY.API_SECRET,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename,
    })
    .catch((error) => {
      console.log(error);
      throw new AppError(StatusCodes.BAD_REQUEST, "Image upload failed");
    });

  return uploadResult;
};

export const fileUploader = {
  upload,
  uploadCloudinary,
};
