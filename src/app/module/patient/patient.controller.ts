import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/queryPick";
import sendResponse from "../../utils/sendResponse";
import { patientFilterableFields } from "./patient.constant";
import { PatientServices } from "./patient.services";

const get = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await PatientServices.get(filters, options);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All patients retrieved successfull",
      data: result,
    });
  }
);

export const PatientController = {
  get,
};
