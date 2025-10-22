import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.services";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AppointmentService.create(
      req.user as JwtPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Appointment create successfull",
      data: result,
    });
  }
);

export const AppointmentController = {
  create,
};
