import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ZodSchema } from "zod";
import { AppError } from "../utils/apiResponse";

export const validate =
  <P = ParamsDictionary>(schema: ZodSchema) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new AppError(firstError.message, firstError.message, 400);
    }

    req.body = result.data;
    next();
  };
