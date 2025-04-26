import { ERROR_CODES_PRISMA } from "@/common/constants/erorr-prisma";
import { ERROR_CODES } from "@/common/constants/error";
import { ApiError } from "@/common/utils/apiError";
import { GenerateId } from "@/common/utils/generate";
import { ConfigEnv } from "@/config/env";
import { DuitkuService } from "@/lib/duitku/duitku";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface CheckoutRequest {
    methodCode : string
    amount : number
    username : string
    transactionId : string
    whatsApp : string
}

export class PaymentRespositories {
    private prisma;
    constructor (prismaClient = prisma){
            this.prisma = prismaClient
    }
    private handlePrismaError(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case ERROR_CODES_PRISMA.CONFLICT:
                throw new ApiError(409, ERROR_CODES.CONFLICT, "Resource already exists");
                case ERROR_CODES_PRISMA.NOT_FOUND:
                throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Resource not found");
                case ERROR_CODES_PRISMA.FOREIGN_KEY:
                throw new ApiError(400, ERROR_CODES.BAD_REQUEST, "Invalid reference to related resource");
                case ERROR_CODES_PRISMA.REQUIRED_FIELD:
                throw new ApiError(400, ERROR_CODES.BAD_REQUEST, "Required field missing");
                default:
                throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database operation failed");
                }
            } else if (error instanceof ApiError) {
                throw error;
            } else {
                throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Unexpected server error");
            }
        }   

        async Checkout(create: CheckoutRequest) {
            try {
              const {whatsApp, amount, methodCode, transactionId, username } = create
              const duitkuService =  new DuitkuService()
              const merchantOrderId = GenerateId("ORDER")
              return await this.prisma.$transaction(async (tx) => {
                const validateTransaction = await tx.transaction.findUnique({
                  where: {
                    transactionId,
                    username,
                    position: 'cart',
                    status: "PENDING"
                  },
                  include: {
                    items: true
                  }
                })
                
                if (!validateTransaction) {
                  return {
                    success: false,
                    message: "Transaction not found or already processed"
                  }
                }
                await tx.transactionItem.updateMany({
                  where: {
                    transactionId
                  },
                  data: {
                    status: "CHECKOUT",
                    updatedAt : new Date()
                  }
                })
                
                const updatedTransaction = await tx.transaction.update({
                  where: {
                    transactionId
                  },
                  data: {
                    amount,
                    method: methodCode,
                    status: "CHECKOUT", 
                    position: "CHECKOUT",
                  },
                  include: {
                    items: true
                  }
                })

                await duitkuService.Create({
                    amount : amount.toString(),
                    code : methodCode,
                    customerName : username,
                    merchantOrderId,
                    productDetails : '',
                    username : username,
                    time : 60 * 60 * 1000,
                    returnUrl : `${ConfigEnv().DUITKU_RETURN_URL}/transaction?id=${transactionId}`
                })
                await tx.payment.create({
                  data: {
                    transactionId,
                    amount,
                    method: methodCode,
                    customerPhone: whatsApp, 
                    status: "PENDING",                    
                    reference: `PAY-${transactionId}`,
                  }
                })
                
                return {
                  data: updatedTransaction,
                  success: true,
                  message: "Checkout Successfully"
                }
              }, {
                timeout: 15000,
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable
              })
              
            } catch (error) {
              console.log(error)
             return {
              success : false,
              message : "Failed To Checkout"
             }
            }
          }
}