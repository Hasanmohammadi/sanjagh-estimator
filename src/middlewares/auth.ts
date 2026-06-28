import { Request, Response, NextFunction } from "express";

const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: replace with real token validation
  // const token = req.headers.authorization?.split(" ")[1];
  // const user = await validateSanjaghToken(token);
  // req.user = user;

  req.user = { id: TEMP_USER_ID };
  next();
};
