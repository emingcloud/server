import { Model } from "../interface/model";
import { db } from "../service/db";

export const MovieRepository = {
  getMovies: async function (limit: number = 30, offset?: string) {
    const query = "SELECT * FROM movies";
    const options = {
      prepare: true,
      fetchSize: Math.min(limit, 30),
      pageState: offset,
    };
    const result = await db.execute(query, [], options);
    return {
      data: result.rows,
      nextPage: result.pageState,
    };
  },
  addMovie: async function (movie: Model.Movie) {
    const query = `insert into movies (
    movie_id,
    title,
    plot,
    release_year,
    rating,
    duration,
    genres,
    poster_url,
    backdrop_url,
    video_url,
    actors,
    created_at,
    embedding ) values (uuid(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      movie.title,
      movie.plot,
      movie.releaseYear,
      movie.rating,
      movie.duration,
      movie.genres,
      movie.posterUrl,
      movie.backdropUrl,
      movie.videoUrl,
      movie.actors,
      new Date().toISOString(),
      movie.embedding,
    ];
    try {
      await db.execute(query, params, { prepare: true });
      return;
    } catch (err) {
      console.log(err);
      throw new Error("failed to add movie");
    }
  },
};
