import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";

const create_patient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.create_patient(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Patient create successfully",
      data: result,
    });
  }
);

export const UserController = {
  create_patient,
};
