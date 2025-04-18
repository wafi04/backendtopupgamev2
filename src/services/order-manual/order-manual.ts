import { ConfigEnv } from "@/config/env";
import prisma from "@/lib/prisma";
import { Order } from "whatsapp-web.js";

export interface OrderManualRequest {
    transactionId : string
    transactionItemId  : string
}


export class OrderManual  {
    private username = ConfigEnv().DIGI_USERNAME as string;
    private DIGI_API_KEY = ConfigEnv().DIGI_API_KEY as string;
    private prisma;

    constructor(prismaClient = prisma) {
        this.prisma = prismaClient;
    }

    async CreateTransaction(req : OrderManualRequest) {
        const {transactionId,transactionItemId} = req;
        const order = await this.prisma.transaction.findFirst({
            where : {
                transactionId
            }
        })
        if(!order) {
            throw new Error("Order not found")
        }
        const orderItem = await this.prisma.transactionItem.findFirst({
            where : {
                transactionItemId
            }
        })
        if(!orderItem) {
            throw new Error("Order Item not found")
        }

        await prisma.transactionItem.update({
            where : {
                transactionItemId
            },
            data : {
                
                status : "SUCCESS"
            }
        })

        
    }
    
}