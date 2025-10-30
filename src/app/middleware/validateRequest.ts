import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateRequest =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bodyData = req.body?.data ? JSON.parse(req.body.data) : req.body;

      const parsedData = await schema.parseAsync({
        body: bodyData,
        query: req.query,
        params: req.params,
      });

      if (parsedData.body) Object.assign(req.body, parsedData.body);
      if (parsedData.query) Object.assign(req.query, parsedData.query);
      if (parsedData.params) Object.assign(req.params, parsedData.params);

      next();
    } catch (error) {
      next(error);
    }
  };
