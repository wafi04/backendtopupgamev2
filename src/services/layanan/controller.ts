import prisma from "@/lib/prisma";

import { Request, Response, Router } from "express";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { ADMIN_ROLE } from "@/common/interfaces/user";
import { asyncHandler } from "@/common/utils/handler";
import { sendResponse } from "@/common/utils/response";
import { ERROR_CODES } from "@/common/constants/error";
import { CreateProduct, FilterProduct, UpdateProduct } from "@/common/interfaces/product";
import { ProductRepository } from "./repository";
import { ProductService } from "./service";

const repository =  new ProductRepository(prisma)
const service = new ProductService(repository)
export const ProductRoutes  : Router = Router()


ProductRoutes.post(
    '/',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const request :CreateProduct = req.body;
        console.log(request)
        if(!request) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.create(request);
        sendResponse(res,data,"Created Product Successfully",201);
    })
);
ProductRoutes.put(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const request : UpdateProduct = req.body;
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.update(request,id);
        sendResponse(res,data,"Updated Product Successfully",200);
    })
);
ProductRoutes.delete(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.delete(id);
        sendResponse(res,data,"Deleted Product Successfully",200);
    })
);
ProductRoutes.get(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.findById(id);
        sendResponse(res,data,"Get Product Successfully",200);
    })
);


ProductRoutes.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
        const filter : FilterProduct = {
            sortPriceAsc : req.query.sortPriceAsc === "PRICEASC" ? true : false,
            search : req.query.search ? String(req.query.search) : undefined,
            categoryId : req.query.category ? Number(req.query.category) : undefined,
            isFlashSale : req.query.flashSale === "ACTIVE" ? "ACTIVE" : undefined,
            status : req.query.status === "ACTIVE" ? "ACTIVE" : undefined,
            page : req.query.page ? Number(req.query.page) : undefined,
            perPage : req.query.perPage ? Number(req.query.perPage) : undefined,
        }
        const data =  await service.findAll(filter);
        sendResponse(res,data,"Get Product Successfully",200);
    })
);
  