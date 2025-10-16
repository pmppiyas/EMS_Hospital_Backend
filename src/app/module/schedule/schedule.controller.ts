import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/queryPick";
import {
  default as sendResponse,
  default as sendResponse,
} from "../../utils/sendResponse";
import { IFilters, IJwtPayload } from "./schedule.interface";
import { ScheduleServices } from "./schedule.services";

const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.createSchedule(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedule create successfull",
      data: result,
    });
  }
);

const getSchedules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const result = await ScheduleServices.getSchedules(
      req.user as IJwtPayload,
      filters,
      options
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedules retrived successfull",
      data: result,
    });
  }
);

const deleteSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ScheduleServices.deleteSchedule(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Schedule delete successfull",
      data: result,
    });
  }
);

export const ScheduleController = {
  createSchedule,
  getSchedules,
  deleteSchedule,
};
