import prisma from "@/lib/prisma";
import { UserRepository } from "../auth/repository/user-repository";
import { PriceTransactions } from "../price-check/price";
import { GenerateId } from "@/common/utils/generate";

interface CreateTransaction {
  items: {
    gameID: string
    gameServer?: string
    nickname?: string
    productCode: string
  }[]
  type: string
  methodCode: string
  username: string
}

interface CartResponse {
  success: boolean;
  code: number;
  data?: any;
  message?: string;
}


interface AddItemsToCart {
    gameId: string
    gameServer: string
    nickname?: string
    productCode: string
    username : string
}

export class TransactionRepository {
  private prisma;
  private user;
  
  constructor(
    prismaClient = prisma,
    user = new UserRepository()
  ) {
    this.prisma = prismaClient;
    this.user = user;
  }
  
  async addToCart(req: CreateTransaction): Promise<CartResponse> {
    try {
      const user = await this.user.getUserByUsername(req.username);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: "User not found"
        };
      }
      
      const transactionId = GenerateId("VAZ");
      
      let totalAmount = 0;
      
      const transactionItems = [];
      
      for (const item of req.items) {
        const priceInfo = await PriceTransactions(user.role, item.productCode);
        
        if (!priceInfo.status) {
          return {
            success: false,
            code: 404,
            message: `Product with code ${item.productCode} not found`
          };
        }
        
        const price = priceInfo.price ?? 0;
        totalAmount += price;
        
        const transactionItem = {
          transactionItemId: GenerateId("ITEM"),
          transactionId: transactionId,
          productCode: item.productCode,
          price: price,
          gameId: item.gameID,
          gameServer: item.gameServer || null,
          nickName: item.nickname || null,
          quantity: 1,
          provider: "DIGIFLAZZ"
        };
        
        transactionItems.push(transactionItem);
      }
      
      const transaction = await this.prisma.transaction.create({
        data: {
          transactionId: transactionId,
          amount: totalAmount,
          type: req.type,
          method: req.methodCode,
          position: "cart",
          username: req.username,
          items: {
            create: transactionItems
          }
        },
        include: {
          items: true
        }
      });
      
      return {
        code: 201,
        success: true,
        data: transaction
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred"
      };
    }
  }
    
    async AddItemToCart(req : AddItemsToCart) {
        const user = await this.user.getUserByUsername(req.username)
        if (!user) {
            return {
                status : false
            }
        }

        const transaction = await prisma.transaction.findFirst({
            where: {
                username: user.username,
                type: "TOPUP",
                position : "cart"
            }
        })

        const priceInfo = await PriceTransactions(user.role, req.productCode);
        
        if (!priceInfo.status) {
          return {
            success: false,
          };
        }
        
        const price = priceInfo.price ?? 0;

        const item =  await prisma.transactionItem.create({
            data: {
                price,
                transactionItemId: GenerateId("ITEM"),
                gameId: req.gameId,
                gameServer : req.gameServer,
                nickName: req.nickname,
                quantity: 1,
                provider : "DIGIFLAZZ",
                productCode: req.productCode,
                transactionId: transaction?.transactionId as string,   
            }
        })
        return {
            data: item,
            success : true
        }
    }


  async getCartByUsername(username: string) {
    try {
      const cart = await this.prisma.transaction.findFirst({
        where: {
          username: username,
          position: "cart"
        },
        include: {
          items: true
        }
      });
      
      if (!cart) {
        return {
          success: false,
          code: 404,
          message: "Cart not found"
        };
      }
      
      return {
        success: true,
        code: 200,
        data: cart
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: error instanceof Error ? error.message : "An unknown error occurred"
      };
    }
}
}