import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getBearer from "./getBearer";
export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getBearer(req);
  try {
    jwt.verify(token!, process.env.access_secret!);
    return next();
  } catch (err) {
    return res.json({
      error: "forbidden",
    });
  }
}
