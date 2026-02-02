import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getBearer from "./getBearer";

export default function admin(req: Request, res: Response, next: NextFunction) {
  const token = getBearer(req);
  try {
    const payload = jwt.verify(token!, process.env.access_secret!);
    if (payload.role !== "admin") {
      return res.json({
        error: "Permission needed: Admin",
      });
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.json({
      error: "forbidden",
    });
  }
}
