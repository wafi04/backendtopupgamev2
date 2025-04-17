import { Client, LocalAuth } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
})

client.on("qr", (qr) => {
  console.log("Scan QR:")
  qrcode.generate(qr, { small: true })
})

client.on("ready", () => {
  console.log("✅ WhatsApp client is ready")
})

client.on("auth_failure", (msg) => {
  console.error("❌ Auth Failure", msg)
})

client.initialize()

export default client
