import Redis from "ioredis";

export async function getMockCache() {
  return new Redis({
    port: parseInt(process.env.REDIS_PORT || "6379"),
    host: process.env.REDIS_URL || "localhost",
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DATABASE || "0"),
  });
}
