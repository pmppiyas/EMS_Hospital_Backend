import * as bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { ENV } from "../../config/env";
import prisma from "../../config/prisma";
import { jwtTokenGen } from "../../helper/jwtTokenGen";
import { verifyToken } from "../../helper/verifyToken";
import { AppError } from "../../utils/appError";
import { UserStatus } from "../user/user.interface";
import { ILoginPayload } from "./auth.interface";

const crdLogin = async (payload: ILoginPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Patient not exist by this gmail."
    );
  }

  const isCorrectPass = await bcrypt.compare(payload.password, user.password);
  if (!isCorrectPass) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, "This password is wrong");
  }

  const { accessToken, refreshToken } = await jwtTokenGen(user);

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const getMe = async (session: any) => {
  const accessToken = session.accessToken;

  const decodedData = verifyToken(accessToken);

  let include: any = {};

  switch (decodedData.role) {
    case "ADMIN":
      include.admin = true;
      break;
    case "DOCTOR":
      include.doctor = true;
      break;
    case "PATIENT":
      include.patient = true;
      break;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
    include: {
      ...include,
    },
  });

  return user;
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = verifyToken(token);
  } catch (err) {
    throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: decodedData.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
  });

  const tokenGen = jwtTokenGen({
    email: user.email,
    role: user.role,
  });

  console.log((await tokenGen).accessToken);

  return {
    accessToken: (await tokenGen).accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const { new_password, old_password } = payload;

  if (!new_password || !old_password) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Both old and new passwords are required"
    );
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
  });

  const isCorrectPass = await bcrypt.compare(old_password, userData.password);

  if (!isCorrectPass) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Old password is incorrect");
  }

  const saltRounds = Number(process.env.BCRYPT_SALTNUMBER);
  const hashedPassword = await bcrypt.hash(new_password, saltRounds);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return "Password change successfully";
};

const resetPassword = async (session: any, payload: any) => {
  const { new_password } = payload;

  if (!new_password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "New password is required");
  }

  const decoded = verifyToken(session.accessToken);

  if (!decoded || typeof decoded !== "object" || !decoded.email) {
    throw new AppError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: {
        not: UserStatus.DELETED,
      },
    },
  });

  const saltRounds = Number(process.env.BCRYPT_SALTNUMBER);
  const hashedPassword = await bcrypt.hash(new_password, saltRounds);

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password reset successfully!",
  };
};

export const AuthServices = {
  crdLogin,
  getMe,
  refreshToken,
  changePassword,
  resetPassword,
};
