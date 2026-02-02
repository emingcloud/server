import { Request } from "express";

export default function getBearer(req: Request) {
  const token = req.get("Authorization")?.split(" ")[1];
  return token;
}
