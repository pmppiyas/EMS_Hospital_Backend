import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { AppError } from "../../utils/appError";

const create = async (req: Request) => {
  const { file } = req;
  let body = req.body;

  if (typeof body.data === "string") {
    body = { ...JSON.parse(body.data), ...body };
    delete body.data;
  }

  if (file) {
    const uploadCloudinary = await fileUploader.uploadCloudinary(file);
    body.icon = uploadCloudinary?.secure_url;
  }

  const exist = await prisma.specialities.findFirst({
    where: {
      title: body.title,
    },
  });
  if (exist) {
    throw new AppError(StatusCodes.CONFLICT, `${body.title} is already exist.`);
  }

  return await prisma.specialities.create({
    data: {
      title: body.title,
      icon: body.icon,
    },
  });
};

export const SpecialityServices = {
  create,
};
