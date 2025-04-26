import { DuitkuResponse } from "@/common/interfaces/duitku";
import { ConfigEnv } from "@/config/env";
import axios from "axios";
import crypto from 'crypto';
interface CreatePayloadDuitku {
    merchantOrderId: string;
    amount: string;
    code: string;
    productDetails: string;
    username: string;
    time: number;
    returnUrl? : string
    customerName : string
  }
export class DuitkuService {
    private DUITKU_MERCHANT_CODE = ConfigEnv().DUITKU_USERNAME
    private DUITKU_API_KEY = ConfigEnv().DUITKU_API_KEY
    private DUITKU_CALLBACK_URL = ConfigEnv().DUITKU_CALLBACK_URL
    private DUITKU_RETURN_URL = ConfigEnv().DUITKU_RETURN_URL

    async Create(req : CreatePayloadDuitku) {
        try {
            const signature = crypto
            .createHash('md5')
            .update(
              this.DUITKU_MERCHANT_CODE +
              req.merchantOrderId +
              req.amount +
              this.DUITKU_API_KEY
            )
            .digest('hex');
            const duitkuPayload = {
                merchantCode: this.DUITKU_MERCHANT_CODE,
                merchantOrderId: req.merchantOrderId,
                paymentAmount: req.amount,
                paymentMethod: req.code,
                customerVaName: req.customerName,
                callbackUrl: this.DUITKU_CALLBACK_URL,
                returnUrl: this.DUITKU_RETURN_URL,
                signature,
              };
            const create = await axios.post<DuitkuResponse>(`${ConfigEnv().DUITKU_BASE_URL}/api/merchant/v2/inquiry`,duitkuPayload,{
                headers: { 'Content-Type': 'application/json' ,},
                 
              })
            return create.data
        } catch (error) {
            console.error(error)
        }
    }
}