import bcrypt from "bcryptjs";
import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { ENV } from "../../config/env";
import prisma from "../../config/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { AppError } from "../../utils/appError";
import {
  createAdminInput,
  createDoctorInput,
  createPatientInput,
  Role,
} from "./user.interface";

const create_patient = async (req: Request) => {
  const salt = ENV.BCRYPT.SALTNUMBER;
  const {
    body,
    file,
  }: { body: createPatientInput; file?: Express.Multer.File } = req;

  if (file) {
    const uploadResult = await fileUploader.uploadCloudinary(file);
    body.profilePhoto = uploadResult.url;
  }

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));
  const isExist = await prisma.user.findUnique({
    where: {
      email: body.email as string,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "Patient data already exist");
  }

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: body.email as string,
        password: hashPassword as string,
      },
    });

    return await tnx.patient.create({
      data: {
        name: body.name as string,
        email: body.email as string,
        contactNumber: body.contactNumber! as string,
        profilePhoto: body.profilePhoto! as string,
        address: body.address! as string,
      },
    });
  });

  return result;
};

const createAdmin = async (req: Request) => {
  const { body, file }: { body: createAdminInput; file?: Express.Multer.File } =
    req;
  const salt = ENV.BCRYPT.SALTNUMBER;

  const isExist = await prisma.user.findUnique({
    where: {
      email: body.admin.email as string,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "Patient data already exist");
  }

  if (file) {
    const uploadResult = await fileUploader.uploadCloudinary(file);
    body.admin.profilePhoto = uploadResult.url;
  }

  const hashPassword = await bcrypt.hash(body.password as string, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: Role.ADMIN,
      },
    });
    const createAdmin = await tnx.admin.create({
      data: req.body.admin,
    });
    return createAdmin;
  });
  return result;
};

const createDoctor = async (req: Request) => {
  const {
    body,
    file,
  }: { body: createDoctorInput; file?: Express.Multer.File } = req;

  const salt = ENV.BCRYPT.SALTNUMBER;

  const isExist = await prisma.user.findUnique({
    where: {
      email: body.doctor.email,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "Doctor already exists");
  }

  if (file) {
    const uploadResult = await fileUploader.uploadCloudinary(file);
    body.doctor.profilePhoto = uploadResult.url;
  }

  const hashPassword = await bcrypt.hash(body.password, Number(salt));

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: body.doctor.email,
        password: hashPassword,
        role: Role.DOCTOR,
      },
    });

    const createdDoctor = await tnx.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctor;
  });

  return result;
};

export const UserServices = {
  create_patient,
  createAdmin,
  createDoctor,
};
