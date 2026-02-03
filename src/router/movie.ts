import { Router } from "express";
import { db } from "../service/db";
import admin from "../helper/admin";
import { MovieRepository } from "../repository/movie_repository";
const router = Router();

router.get("/", async (req, res) => {
  const { limit, offset } = req.query;
  const result = await MovieRepository.getMovies(
    limit ? Number(limit) : 30,
    offset ? offset.toString() : undefined,
  );
  return res.json(result);
});
router.post("/", admin, async (req, res, next) => {
  console.log(req.body);
  const {
    title,
    plot,
    releaseYear,
    rating,
    duration,
    genres,
    posterUrl,
    backdropUrl,
    videoUrl,
    actors,
    embedding,
  } = req.body;

  try {
    await MovieRepository.addMovie({
      title,
      plot,
      releaseYear,
      actors,
      backdropUrl,
      posterUrl,
      videoUrl,
      rating,
      duration,
      genres,
      embedding,
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
  return res.json({
    data: true,
  });
});

// @ts-expect-error
router.use("/", (err, req, res, next) => {
  return res.json({
    error: err.message,
  });
});

export const movieRouter = router;
