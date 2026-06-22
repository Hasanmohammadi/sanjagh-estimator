import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ZodType } from "zod";
import { AppError } from "../utils/apiResponse";

export const validate =
  <P = ParamsDictionary>(schema: ZodType) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new AppError(firstError.message, firstError.message, 400);
    }

    req.body = result.data;
    next();
  };
