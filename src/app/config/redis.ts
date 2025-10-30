import { createClient } from "redis";
import { ENV } from "./env";

const redisClient = createClient({
  username: ENV.REDIS.DB_NAME,
  password: ENV.REDIS.DB_PASS,
  socket: {
    host: ENV.REDIS.DB_HOST,
    port: Number(ENV.REDIS.DB_PORT),
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected");
  }
};
