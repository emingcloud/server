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
    release_year,
    rating,
    duration,
    genres,
    poster_url,
    actors,
  } = req.body;
  const query = `
      INSERT INTO movies (movie_id, title, plot, release_year, rating, duration, actors, poster_url, embedding)
      VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const params = [
    title,
    plot,
    release_year,
    rating,
    duration,
    actors,
    poster_url,
    null, // replace with 'embedding' variable if using vector search
  ];
  try {
    await db.execute(query, params, { prepare: true });
  } catch (err) {
    console.log(err);
    return next(new Error("movie could not be created"));
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
