import { Client } from "cassandra-driver";
import shutdown from "./src/helper/shutdown";
const client = new Client({
  contactPoints: ["192.168.19.254:9042"],
  localDataCenter: "datacenter1",
});

await client.connect();

await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS dev 
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
  `);

await client.execute(`create table if not exists dev.user (
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
await client.shutdown();

console.log("done mirgation");
