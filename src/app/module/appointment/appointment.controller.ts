import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/queryPick";
import sendResponse from "../../utils/sendResponse";
import { AppointmentService } from "./appointment.services";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AppointmentService.create(
      req.user as IJwtPayload,
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

const getAppointments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["status", "paymentStatus"]);
    const result = await AppointmentService.getAppointments(
      req.user as IJwtPayload,
      fillters,
      options
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All appointment retrieved successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  create,
  getAppointments,
};
