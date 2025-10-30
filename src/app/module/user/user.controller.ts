import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/queryPick";
import sendResponse from "../../utils/sendResponse";
import { userFilterableFields, userQueryFields } from "./user.constant";
import { UserStatus } from "./user.interface";
import { UserServices } from "./user.services";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, userQueryFields);
    const filters = pick(req.query, userFilterableFields);

    const result = await UserServices.getAllUser(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All user retrieved successfully",
      data: result,
    });
  }
);

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

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createAdmin(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Admin create successfully",
      data: result,
    });
  }
);

const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createDoctor(req);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Doctor create successfully",
      data: result,
    });
  }
);

const changeUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.changeUserStatus(
      req.params.id,
      req.params.status.toUpperCase() as UserStatus
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User ${req.params.status} successfully`,
      data: result,
    });
  }
);

export const UserController = {
  getAllUser,
  create_patient,
  createAdmin,
  createDoctor,
  changeUserStatus,
};
