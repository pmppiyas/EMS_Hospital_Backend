import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SpecialityServices } from "./speciality.services";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialityServices.create(req);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Speciality create successfull",
      data: result,
    });
  }
);

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialityServices.gelAll();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All specialities retrieved successfull",
      data: result,
    });
  }
);

const deleteSpeciality = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialityServices.deleteSpeciality(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "This specialities delete successfull",
      data: result,
    });
  }
);

export const SpecialityController = {
  create,
  getAll,
  deleteSpeciality,
};
