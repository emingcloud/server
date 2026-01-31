import { db } from "../service/db";
import server from "..";
export default async function shutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);

  // 1. Stop the Express server from taking new hits
  server.close(() => {
    console.log("HTTP server closed.");
  });

  try {
    // 2. Close the ScyllaDB connection pool
    // This is the most important step for your "zombie" problem
    await db.shutdown();
    console.log("ScyllaDB connections closed.");

    // 3. Exit the process safely
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}
