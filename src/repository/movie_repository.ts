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
};
