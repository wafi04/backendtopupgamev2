import prisma from "@/lib/prisma";
import { Request, Response, Router } from "express";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { ADMIN_ROLE } from "@/common/interfaces/user";
import { asyncHandler } from "@/common/utils/handler";
import { sendResponse } from "@/common/utils/response";
import { ERROR_CODES } from "@/common/constants/error";
import { FilterProduct, UpdateProduct } from "@/common/interfaces/product";
import { ProductRepository } from "./repository";
import { ProductService } from "./service";

const repository =  new ProductRepository(prisma)
const service = new ProductService(repository)
export const ProductRoutes  : Router = Router()


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
    const rawStatus = req.query.status as string; 
    let active: boolean | undefined;

    if (rawStatus === "active") active = true;
    else if (rawStatus === "inactive") active = false;
    else if (rawStatus === "all" || !rawStatus) active = undefined;
        
    const filter: FilterProduct = {
      sortPriceAsc: req.query.sortPriceAsc === "PRICEASC" ? true : false,
      search: req.query.search ? String(req.query.search) : undefined,
      categoryId: req.query.category ? Number(req.query.category) : undefined,
      isFlashSale: req.query.flashSale === "active",
      status: active,
      page: req.query.page ? Number(req.query.page) : undefined,
      perPage: req.query.perPage ? Number(req.query.perPage) : undefined,
    }
    
    const data = await service.findAll(filter);
    sendResponse(res, data, "Get Products Successfully", 200);
  })
);
  
ProductRoutes.get('/category/code', asyncHandler(async (req: Request, res: Response) => {
    const filter = {
        code: req.query.code as string,
        subcategory : req.query.subcategory as string
    }
    console.log(filter.code)
    if (!filter.code) {
       sendResponse(res,undefined,"Missing Code Category",404)
    }
    const data = await service.findProductByCategory(filter.code)
    sendResponse(res,data,"Get Products Successfully",200)
}))