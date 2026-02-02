import { Client } from "cassandra-driver";
const client = new Client({
  contactPoints: ["192.168.19.254:9042"],
  localDataCenter: "datacenter1",
});

await client.connect();

await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS dev 
    WITH replication = {
      'class': 'NetworkTopologyStrategy',
      'replication_factor': 1
    }
    and tablets = {
      'enabled': true
    }
  `);

await client.execute(`create table if not exists dev.users (
    user_id UUID,
    email TEXT,
    name TEXT,
    password TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id)
);`);
await client.execute(`create table if not exists dev.user_by_email (
    email TEXT,
    user_id uuid,
    primary key (email)
);`);
await client.execute(`create table if not exists dev.refresh_token (
    user_id uuid,
    token_value text,
    device_info text,
    created_at timestamp,
    PRIMARY KEY (user_id, token_value)
);`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS dev.movies (
    movie_id uuid,
    title text,
    plot text,
    release_year int,
    rating text,
    duration int,
    genres set<text>,
    poster_url text,
    backdrop_url text,
    video_url text,
    actors list<text>,
    created_at timestamp,
    embedding vector<float, 1024>,
    primary key (movie_id)
  ) ;`);

await client.execute(`CREATE CUSTOM INDEX IF NOT EXISTS ann_idx
ON dev.movies(embedding)
USING 'vector_index'
WITH OPTIONS = { 'similarity_function': 'DOT_PRODUCT' };`);
await client.shutdown();

console.log("done mirgation");
