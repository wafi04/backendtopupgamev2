import prisma from "@/lib/prisma";
import { UserRepository } from "../auth/repository/user-repository";
import { PriceTransactions } from "../price-check/price";
import { GenerateId } from "@/common/utils/generate";

interface CreateTransaction {
  items: {
    gameId: string
    gameServer?: string
    nickname?: string
    productCode: string
  }[]
  type: string
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
      
      const existingCart = await this.prisma.transaction.findFirst({
        where: {
          username: user.username,
          type: "TOPUP",
          position: "CART"
        }
      });
      
      const transactionId = existingCart?.transactionId ?? GenerateId("VAZ");
      
      // Initialize with 0
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
        // Use simple addition for integers
        totalAmount += parseInt(price.toString(), 10);
        
        const transactionItem = {
          transactionItemId: GenerateId("ITEM"),
          productCode: item.productCode, 
          transactionId: transactionId,
          price: price,
          productImage : priceInfo.logo,
          gameId: item.gameId,
          productName : priceInfo.productName,
          gameServer: item.gameServer || null,
          nickName: item.nickname || null,
          quantity: 1,
          provider: "DIGIFLAZZ"
        };
        
        transactionItems.push(transactionItem);
      }
  
      let transaction;
      if (!existingCart) {
        transaction = await this.prisma.transaction.create({
          data: {
            transactionId: transactionId,
            amount: totalAmount,
            type: req.type,
            position: "CART",
            username: req.username,
            items : {
              create: transactionItems.map(item => {
                const { transactionId, ...itemWithoutTransactionId } = item;
                return itemWithoutTransactionId;
              })
            },
          },
          include: {
            items: true
          }
        });
      } else {
        try {
          const results = await Promise.all(
            transactionItems.map((item) => {
              return this.addItemToCart({
                gameId: item.gameId,
                gameServer: item.gameServer ?? '',
                productCode: item.productCode, 
                username: user.username,
                nickname: item.nickName ?? ''
              });
            })
          );
          
          const failedItems = results.filter(result => !result.success);
          if (failedItems.length > 0) {
            return {
              success: false,
              code: 400,
              message: "Failed to add some items to cart"
            };
          }
          
          transaction = await this.prisma.transaction.findFirst({
            where: { transactionId: transactionId },
            include: { items: true }
          });
        } catch (error) {
          return {
            success: false,
            code: 500,
            message: "Failed to add items to cart"
          };
        }
      }
      
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
  
  async addItemToCart(req: AddItemsToCart) {
    try {
      const user = await this.user.getUserByUsername(req.username);
      if (!user) {
        return {
          success: false,
          message: "User not found"
        };
      }
  
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          username: user.username,
          type: "TOPUP",
          position: "cart"
        }
      });
  
      if (!transaction) {
        return {
          success: false,
          message: "Cart not found"
        };
      }
  
      const priceInfo = await PriceTransactions(user.role, req.productCode);
      if (!priceInfo.status) {
        return {
          success: false,
          message: "Product not found"
        };
      }
      
      const price = priceInfo.price ?? 0;
  
      const item = await this.prisma.transactionItem.create({
        data: {
          price,
          transactionItemId: GenerateId("ITEM"),
          gameId: req.gameId,
          gameServer: req.gameServer,
          nickName: req.nickname,
          productName : priceInfo.productName,
          quantity: 1,
          productImage : priceInfo.logo,
          provider: "DIGIFLAZZ",
          productCode: req.productCode,
          transactionId: transaction.transactionId,   
        }
      });
  
      await this.prisma.transaction.update({
        where: {
          transactionId: transaction.transactionId
        },
        data: {
          amount: transaction.amount + parseInt(price.toString(), 10)
        }
      });
      
      return {
        success: true,
        data: item
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred"
      };
    }
  }
  async getCartByUsername(username: string) {
    try {
      const cart = await this.prisma.transaction.findFirst({
        where: {
          username: username,
          position: "CART",
          status : "PENDING"
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

      const amountItems =  cart.items.length ?? 0

      
      const data = {
          cart,
          amountItems
      }
      
      return {
        success: true,
        code: 200,
        data
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