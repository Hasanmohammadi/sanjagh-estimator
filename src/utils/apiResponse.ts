import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// 1. Define the Standard Response Structure
export interface ApiError {
  en: string;
  fa: string;
}

export interface ApiResponse<T = any> {
  data: T | null;
  status: "success" | "error";
  error: ApiError | null;
}

// 2. Custom Error Class to handle bilingual messages
export class AppError extends Error {
  public statusCode: number;
  public faMessage: string;

  constructor(messageEn: string, messageFa: string, statusCode: number = 500) {
    super(messageEn);
    this.statusCode = statusCode;
    this.faMessage = messageFa;
    this.name = "AppError";
  }
}

// 3. Helper function to send success responses
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
  const response: ApiResponse<T> = {
    data: data,
    status: "success",
    error: null,
  };
  return res.status(statusCode).json(response);
}

// 4. Async Wrapper to catch errors automatically
export const asyncHandler = <P = ParamsDictionary>(
  fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// 5. Global Error Handling Middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    const response: ApiResponse<null> = {
      data: null,
      status: "error",
      error: {
        en: err.message,
        fa: err.faMessage,
      },
    };
    return res.status(err.statusCode).json(response);
  } else if (err.message.includes("foreign key constraint")) {
    const response: ApiResponse<null> = {
      data: null,
      status: "error",
      error: {
        en: "The referenced project does not exist",
        fa: "پروژه مورد نظر یافت نشد",
      },
    };
    return res.status(400).json(response);
  }

  // فقط خطاهای unexpected رو لاگ کن
  console.error("Unexpected Error:", err.message, err.stack);
  const response: ApiResponse<null> = {
    data: null,
    status: "error",
    error: {
      en: "An unexpected error occurred",
      fa: "خطای پیش بینی نشده ای رخ داد",
    },
  };
  return res.status(500).json(response);
};
