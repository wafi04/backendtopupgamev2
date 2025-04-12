import { URL_WHATSAPP } from "@/common/constants"
import { ApiError } from "@/common/utils/apiError"
import axios from "axios"

interface payloadWhatsApp {
    chatId : string
    session : string
    text :  string
}
export async function WhatsApp(message : string,phoneNumber : string){
    try {
        const payload : payloadWhatsApp = {
            chatId : `62${phoneNumber}@c.us`,
            text : message,
            session : "default",
        }
        const req =  await axios.post(URL_WHATSAPP,payload)
        return  req.data
    } catch (error) {
        throw new ApiError(504,"BAD_REQUEST","failed to send whatsapp",error)
    }
}