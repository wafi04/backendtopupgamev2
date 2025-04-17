import { whatsappQueue } from "./queue"

export async function sendMessageToQueue(phone: string, message: string) {
  await whatsappQueue.add("sendMessage", {
    chatId: `${phone}@c.us`,
    text: message,
  })
}
