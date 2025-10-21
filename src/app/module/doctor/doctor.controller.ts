import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/queryPick";
import sendResponse from "../../utils/sendResponse";
import { doctorFilterableFields, doctorOptionsFields } from "./doctor.constant";
import { DoctorServices } from "./doctor.services";

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, doctorOptionsFields);
    const filters = pick(req.query, doctorFilterableFields);
    const result = await DoctorServices.getAll(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All doctor retrieved successfull",
      data: result,
    });
  }
);

export const DoctorController = {
  getAll,
};
