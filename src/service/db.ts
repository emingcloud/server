import cassandra from "cassandra-driver";

export const db = new cassandra.Client({
  contactPoints: ["192.168.19.254:9042"],
  localDataCenter: "datacenter1",
  keyspace: "dev",
});
