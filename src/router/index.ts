import { Router } from "express";
import { userRouter } from "./user";
import { movieRouter } from "./movie";
import authenticate from "../helper/authenticate";

const router = Router();

router.use("/users", userRouter);
router.use("/movies", authenticate, movieRouter);
export default router;
