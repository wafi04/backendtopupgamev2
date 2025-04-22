import { ConfigEnv } from "@/config/env";
import crypto from 'crypto';

interface TopUpRequest {
    userId: string;
    serverId?: string;
    reference: string;
    productCode: string;
}

export type REQUESTTODIGI = "CreateTransaction" | "GetTransactionStatus" | "GetTransactionHistory" | "GetProductList";

export class Digiflazz {
    private DIGI_USERNAME = ConfigEnv().DIGI_USERNAME as string;
    private DIGI_API_KEY = ConfigEnv().DIGI_API_KEY as string;
    private BASE_URL = `https://api.digiflazz.com/v1`;

    private CreateSign(req: REQUESTTODIGI, reference?: string): string {
        return crypto
            .createHash('md5')
            .update(this.DIGI_USERNAME + this.DIGI_API_KEY + (reference || ''))
            .digest('hex');
    }

    async CreateTransaction(create: TopUpRequest) {
        const url = `${this.BASE_URL}/transaction`;
        const signature = this.CreateSign("CreateTransaction", create.reference);
        
        const payload = {
            username: this.DIGI_USERNAME,
            buyer_sku_code: create.productCode,
            customer_no: create.userId,
            ref_id: create.reference,
            sign: signature
        };

        if (create.serverId) {
            payload['customer_no'] = `${create.userId}${create.serverId}`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    async GetTransactionStatus(reference: string) {
        const url = `${this.BASE_URL}/transaction`;
        const signature = this.CreateSign("GetTransactionStatus", reference);
        
        const payload = {
            username: this.DIGI_USERNAME,
            ref_id: reference,
            sign: signature
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting transaction status:', error);
            throw error;
        }
    }

    async GetProductList() {
        const url = `${this.BASE_URL}/price-list`;
        const signature = this.CreateSign("GetProductList");
        
        const payload = {
            cmd: "prepaid",
            username: this.DIGI_USERNAME,
            sign: signature
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting product list:', error);
            throw error;
        }
    }
}
