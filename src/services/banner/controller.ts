import { CreateBanner, UpdateBanner } from "@/common/interfaces/banner";
import { ADMIN_ROLE } from "@/common/interfaces/user"; 
import { asyncHandler } from "@/common/utils/handler";
import { sendResponse } from "@/common/utils/response";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { Request, Response, Router } from "express";
import prisma from "@/lib/prisma";
import { BannerRepository } from "./repository";
import { BannerService } from "./services";

export const bannerRoutes: Router = Router()
const repo = new BannerRepository(prisma)
const service = new BannerService(repo)

bannerRoutes.post('/', 
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]), 
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.body.urlImage) {
      return sendResponse(res, undefined, "URL Image is required", 400);
    }
    
    const body = {
      urlImage: req.body.urlImage,
      description: req.body.description ?? undefined,
      title: req.body.title ?? undefined
    }
    
    try {
      // Use await to properly handle the Promise
      const create = await service.create(body);
      return sendResponse(res, create, "Banner Created Successfully", 201);
    } catch (error) {
      console.error("Error creating banner:", error);
      return sendResponse(res, undefined, "Failed to create banner", 500);
    }
  })
);

bannerRoutes.put('/:id', 
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendResponse(res, undefined, "Invalid ID", 400);
    }
    
    const body = {
      urlImage: req.body.urlImage,
      description: req.body.description ?? undefined,
      title: req.body.title ?? undefined
    }
    
    try {
      const updated = await service.Update(body, id);
      return sendResponse(res, updated, "Banner Updated Successfully", 200);
    } catch (error) {
      console.error("Error updating banner:", error);
      return sendResponse(res, undefined, "Failed to update banner", 500);
    }
  })
);

bannerRoutes.delete('/:id',
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendResponse(res, undefined, "Invalid ID", 400);
    }
    
    try {
      const deleted = await service.Delete(id);
      return sendResponse(res, deleted, "Banner Deleted Successfully", 200);
    } catch (error) {
      console.error("Error deleting banner:", error);
      return sendResponse(res, undefined, "Failed to delete banner", 500);
    }
  })
);

bannerRoutes.get('/',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const banners = await service.GetAll();
      return sendResponse(res, banners, "Banners Retrieved Successfully", 200);
    } catch (error) {
      console.error("Error retrieving banners:", error);
      return sendResponse(res, undefined, "Failed to retrieve banners", 500);
    }
  })
);