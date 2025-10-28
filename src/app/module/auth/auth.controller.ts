import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../config/prisma";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";

const crdLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.crdLogin(req.body);

    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Credientials login successfully",
      data: {
        needPasswordChange,
      },
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userSession = req.cookies;

    const result = await AuthServices.getMe(userSession);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Credientials login successfully",
      data: result,
    });
  }
);

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    res.cookie("accessToken", result.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Refreash token retrieved successfully",
      data: {
        needPasswordChange: result.needPasswordChange,
      },
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password change successfully",
      data: result,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.resetPassword(req.cookies, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset successfully",
      data: result,
    });
  }
);
export const AuthController = {
  crdLogin,
  getMe,
  refreshToken,
  changePassword,
  resetPassword,
};
