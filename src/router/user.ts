import { Router } from "express";
import { db } from "../service/db";
import { v4 } from "uuid";
import validateEmail from "../helper/validateEmail";
import validatePassword from "../helper/validatePassword";
import hashPassword from "../helper/hashPassword";
import verifyPassword from "../helper/verifyPassword";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/signup", async (req, res, next) => {
  const { email, name, password } = req.body;

  if (!validateEmail(email)) return next(new Error("invalid email"));
  if (!validatePassword(password)) return next(new Error("invalid password"));

  const userId = v4();

  try {
    const claim = await db.execute(
      "INSERT INTO user_by_email (email, user_id) VALUES (?, ?) IF NOT EXISTS",
      [email, userId],
      { prepare: true },
    );

    if (!claim.wasApplied()) {
      return next(new Error("email has already existed"));
    }

    const hashedPassword = await hashPassword(password);
    const userResult = await db.execute(
      "INSERT INTO users (user_id, email, name, password, created_at) VALUES (?, ?, ?, ?, ?) IF NOT EXISTS",
      [userId, email, name, hashedPassword, new Date()],
      { prepare: true },
    );

    if (!userResult.wasApplied()) throw new Error("something went wrong!");

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    db.execute("DELETE FROM user_by_email WHERE email = ?", [email], {
      prepare: true,
    });

    return next(err);
  }
});
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) return next(new Error("invalid email"));
  if (!validatePassword(password)) return next(new Error("invalid password"));

  try {
    const { rows } = await db.execute(
      "select user_id from user_by_email where email = ?",
      [email],
      { prepare: true },
    );
    if (!rows[0]) throw next(new Error("email not exist"));
    const { rows: users } = await db.execute(
      "select * from users where user_id = ?",
      [rows[0].get("user_id")],
      { prepare: true },
    );
    const user = users[0];
    const verified = await verifyPassword(password, user.get("password"));
    if (!verified) {
      throw next(new Error("password incorrect"));
    }
    const payload = {
      id: user.get("user_id"),
      role: user.get("role"),
    };
    const accessToken = jwt.sign(payload, process.env.access_secret!, {
      expiresIn: "60m",
    });
    const refreshToken = jwt.sign(payload, process.env.refresh_secret!, {
      expiresIn: "7d",
    });
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    return res.json({
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return next(new Error("something went wrong!"));
  }
});
router.post("/refresh", async (req, res) => {});
// @ts-expect-error
router.use((err: Error, req, res, next) => {
  return res.json({ error: err.message });
});
export const userRouter = router;
