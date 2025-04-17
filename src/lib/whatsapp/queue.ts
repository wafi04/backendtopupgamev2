import { ConfigEnv } from "@/config/env"
import { Queue } from "bullmq";
import IORedis from "ioredis"

const redisUrl = new URL(ConfigEnv().REDIS_URL as string);
const port = redisUrl.port ? parseInt(redisUrl.port) : 6379;

const connection = new IORedis(port, {
  host: redisUrl.hostname, 
  password: redisUrl.password, 
});

export const whatsappQueue = new Queue("whatsapp-messages", {
  connection,
});
