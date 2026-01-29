import { Queue } from "bullmq";
import IORedis from "ioredis";

import dotenv from "dotenv";
dotenv.config(); // loads .env into process.env

// Create a single Redis connection
export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // ✅ must be null for BullMQ
});

connection.on("connect", () => console.log("✅ Redis connected!"));
connection.on("error", (err) => console.error("❌ Redis error:", err));

export const listingQueue = new Queue("listing-processing", { connection });
