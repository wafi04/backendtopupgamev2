import { Worker } from "bullmq"
import IORedis from "ioredis"
import client from "./client"

const connection = new IORedis("redis://localhost:6379",{
    maxRetriesPerRequest: null,

})

const worker = new Worker(
  "whatsapp-messages",
  async (job) => {
    const { chatId, text } = job.data

    if (client.info && client.info.wid) {
      await client.sendMessage(chatId, text)
      console.log(`✅ Sent to ${chatId}: ${text}`)
    } else {
      throw new Error("WA client not ready")
    }
  },
  { connection }
)

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message)
})
