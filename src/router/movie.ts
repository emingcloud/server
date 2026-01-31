import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();

router.get("/", async (req, res) => {
  console.log(req.header("Authorization"));
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(process.env.access_secret);
  if (!token || !jwt.verify(token, process.env.access_secret!)) {
    return res.json({ error: "forbidden" });
  }
  return res.json();
});

export const movieRouter = router;
