import { Request, Response, Router } from "express";
import { TransactionRepository } from "./repositories";
import prisma from "@/lib/prisma";
import { UserRepository } from "../auth/repository/user-repository";
import {  ContextAwareMiddleware, RequestAuthContext } from "@/middleware/middleware-auth";
import { asyncHandler } from "@/common/utils/handler";
import { sendResponse } from "@/common/utils/response";

export const transactionController: Router = Router();
const userRepo = new UserRepository();
const repository = new TransactionRepository(prisma, userRepo);

transactionController.post('/cart', ContextAwareMiddleware.authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const body = {
    items: req.body.items || [],
    type: req.body.type,
    methodCode: req.body.methodCode,
  };
    
  const authContext = (req as RequestAuthContext).authContext;
  
 
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    sendResponse(res,undefined,"No items provided",400)
  }
  
  if (!body.type || !body.methodCode) {
    sendResponse(res,undefined,"Missing required fields",400)
  }
  
    const result = await repository.addToCart({
        ...body,
        username : authContext.username
  });
  
  sendResponse(res,result,"Cart Created Successfully",201)
}));


transactionController.post("/cartitem", ContextAwareMiddleware.authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const body = {
        gameId: req.body.gameId,
        gameServer: req.body.gameServer,
        productCode: req.body.productCode,
        nickname : req.body.nickName ?? undefined
    }
      const authContext = (req as RequestAuthContext).authContext;

    const addItems = repository.AddItemToCart({
        ...body,
        username : authContext.username
    })
    if (!addItems) {
        sendResponse(res,undefined,"Failed Add Items to Cart")
    }
    sendResponse(res,addItems,"Add Items To Cart Successfully",201)
}))


transactionController.get('/cart', ContextAwareMiddleware.authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const authContext = (req as RequestAuthContext).authContext;
  const cart = await repository.getCartByUsername(authContext.username)
  sendResponse(res,cart,"Get Cart Successfully",200)
}))