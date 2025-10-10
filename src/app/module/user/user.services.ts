import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import { AppError } from "../../utils/appError";
import { createPatientInput } from "./user.interface";

const create_patient = async (payload: createPatientInput) => {
  const salt = process.env.SALTNUMBER;
  const hashPassword = await bcrypt.hash(
    payload.password as string,
    Number(salt)
  );
  const isExist = await prisma.user.findUnique({
    where: {
      email: payload.email as string,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "Patient data already exist");
  }

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: payload.email as string,
        password: hashPassword as string,
      },
    });

    return await tnx.patient.create({
      data: {
        name: payload.name as string,
        email: payload.email as string,
      },
    });
  });

  return result;
};

export const UserServices = {
  create_patient,
};
