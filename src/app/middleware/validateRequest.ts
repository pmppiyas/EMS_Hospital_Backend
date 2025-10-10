import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (ZodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = JSON.parse(req.body.data);

      req.body = await ZodSchema.parseAsync(parsedData);

      next();
    } catch (error) {
      next(error);
    }
  };
