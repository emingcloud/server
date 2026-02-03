import { UUID } from "node:crypto";

export namespace Model {
  export interface Movie {
    movieId?: UUID;
    title: string;
    plot: string;
    releaseYear: number;
    rating: string;
    duration: number;
    genres: Set<string>;
    posterUrl: string;
    backdropUrl: string;
    videoUrl: string;
    actors: Set<string>;
    embedding: number[];
    createdAt?: Date;
  }
}
