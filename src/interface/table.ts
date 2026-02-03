import { UUID } from "crypto";

export namespace Table {
  export interface Movie {
    movie_id: UUID;
    title: string;
    plot: string;
    release_year: number;
    rating: string;
    duration: number;
    genres: Set<string>;
    poster_url: string;
    backdrop_url: string;
    video_url: string;
    actors: Set<string>;
    embedding: number[];
    created_at: Date;
  }
}
