import { Prescription } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../../../types/common";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PrescriptionService } from "./prescription.services";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PrescriptionService.create(
      req.user as IJwtPayload,
      req.params.id,
      req.body as Partial<Prescription>
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription added successfull",
      data: result,
    });
  }
);

const get = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PrescriptionService.get(req.user as IJwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Prescription retrieved successfull",
      data: result,
    });
  }
);

export const PrescriptionController = {
  create,
  get,
};
