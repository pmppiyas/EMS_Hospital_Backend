import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DoctorScheduleServices } from "./doctor.services";

const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await DoctorScheduleServices.createSchedule(
      req.user as IJwtPayload,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor schedule create successfull",
      data: result,
    });
  }
);

export const DoctorSchedulesController = {
  createSchedule,
};
