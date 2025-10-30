import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MetaServices } from "./meta.services";

const fetchDashboardMetaData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MetaServices.fetchDashboardMetaData(
      req.user as IJwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Metadata retrieved successfully",
      data: result,
    });
  }
);

export const MetaController = {
  fetchDashboardMetaData,
};
