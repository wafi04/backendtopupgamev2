import prisma from "@/lib/prisma";
import { LayananRepository } from "./repository";
import { LayananService } from "./service";
import { Request, Response, Router } from "express";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { ADMIN_ROLE } from "@/common/interfaces/user";
import { asyncHandler } from "@/common/utils/handler";
import { CreateLayanan, FilterLayanan } from "@/common/interfaces/layanan";
import { sendResponse } from "@/common/utils/response";
import { ERROR_CODES } from "@/common/constants/error";

const repository =  new LayananRepository(prisma)
const service = new LayananService(repository)
export const layananRoutes  : Router = Router()


layananRoutes.post(
    '/',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const request :CreateLayanan = req.body;
        console.log(request)
        if(!request) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.create(request);
        sendResponse(res,data,"Created Layanan Successfully",201);
    })
);
layananRoutes.put(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const request : CreateLayanan = req.body;
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.update(request,id);
        sendResponse(res,data,"Updated Layanan Successfully",200);
    })
);
layananRoutes.delete(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.delete(id);
        sendResponse(res,data,"Deleted Layanan Successfully",200);
    })
);
layananRoutes.get(
    '/:id',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if(!id) {
            sendResponse(res,null,ERROR_CODES.BAD_REQUEST,400);
        }
        const data =  await service.findById(id);
        sendResponse(res,data,"Get Layanan Successfully",200);
    })
);


layananRoutes.get(
    '/',
    ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
    asyncHandler(async (req: Request, res: Response) => {
        const filter : FilterLayanan = {
            cheaptoexpensive : req.query.cheaptoexpensive === "CHEAPTOEXPENSIVE" ? true : false,
            expensivetocheap : req.query.expensivetocheap === "EXPENSIVETOCHEAP" ? true : false,
            search : req.query.search ? String(req.query.search) : undefined,
            kategoryId : req.query.category ? Number(req.query.category) : undefined,
            flashSale : req.query.flashSale === "ACTIVE" ? "ACTIVE" : undefined,
            status : req.query.status === "ACTIVE" ? "ACTIVE" : undefined,
            page : req.query.page ? Number(req.query.page) : undefined,
            perPage : req.query.perPage ? Number(req.query.perPage) : undefined,
        }
        const data =  await service.findAll(filter);
        sendResponse(res,data,"Get Layanan Successfully",200);
    })
);
  