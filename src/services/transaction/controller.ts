import { Request, Response, Router } from "express";
import { TransactionRepository } from "./repositories";
import prisma from "@/lib/prisma";
import { UserRepository } from "../auth/repository/user-repository";
import {  ContextAwareMiddleware, RequestAuthContext } from "@/middleware/middleware-auth";
import { asyncHandler } from "@/common/utils/handler";
import { sendResponse } from "@/common/utils/response";

export const transactionRoutes: Router = Router();
const userRepo = new UserRepository();
const repository = new TransactionRepository(prisma, userRepo);

transactionRoutes.post(
  '/cart',
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const body = {
      items: req.body.items || [],
    };

    const authContext = (req as RequestAuthContext).authContext;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return sendResponse(res, undefined, "No items provided", 400);
    }

    console.log(body)

    const result = await repository.addToCart({
      ...body,
      type: "TOPUP",
      username: authContext.username,
    });

    if (!result.success) {
      return sendResponse(res, undefined, "Failed To Create Cart", 400);
    }

    return sendResponse(res, result.data, "Cart Created Successfully", result.code);
  })
);


transactionRoutes.post("/cartitem", ContextAwareMiddleware.authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const body = {
        gameId: req.body.gameId,
        gameServer: req.body.gameServer,
        productCode: req.body.productCode,
        nickname : req.body.nickName ?? undefined
    }
      const authContext = (req as RequestAuthContext).authContext;
      if(!body){
        sendResponse(res,undefined,"Missing required Fields")
      }
    const addItems = repository.addItemToCart({
        ...body,
        username : authContext.username
    })
    if (!addItems) {
        sendResponse(res,undefined,"Failed Add Items to Cart")
    }
    sendResponse(res,addItems,"Add Items To Cart Successfully",201)
}))


transactionRoutes.get('/cart', ContextAwareMiddleware.authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const authContext = (req as RequestAuthContext).authContext;
  const cart = await repository.getCartByUsername(authContext.username)
  sendResponse(res,cart,"Get Cart Successfully",200)
}))