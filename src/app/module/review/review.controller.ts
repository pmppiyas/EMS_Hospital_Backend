import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.services";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReviewServices.create(
      req.user as IJwtPayload,
      req.params.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Review create successfull",
      data: result,
    });
  }
);

const get = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ReviewServices.get(req.user as IJwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Your reviews retrived successfull",
      data: result,
    });
  }
);

export const ReviewController = {
  create,
  get,
};
