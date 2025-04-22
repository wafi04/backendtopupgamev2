import { NextFunction, Request, Response, Router } from "express";
import { SubCategoryRepositories } from "../repository/subCategory";
import { SubCategoryService } from "../service/categories";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { ADMIN_ROLE } from "@/common/interfaces/user";
import { sendResponse } from "@/common/utils/response";
import { FilterSubcategory } from "@/common/interfaces/categories";
import prisma from "@/lib/prisma";

const subcategoriesRepo = new SubCategoryRepositories(prisma);
const subCategoriesService = new SubCategoryService(subcategoriesRepo);
export const subCategoriesController: Router = Router();
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

subCategoriesController.post(
  "/",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const data = await subCategoriesService.Create(req.body);
    sendResponse(res, data, "Create Sub category Successfully", 201);
  })
);
subCategoriesController.get(
  "/",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const rawActive = req.query.active as string;

    let active: boolean | undefined;
    if (rawActive === "active") active = true;
    else if (rawActive === "inactive") active = false;

    const filter: FilterSubcategory = {
      active,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
      limit: parseInt(req.query.limit as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      search: (req.query.search as string) ?? "",
    };
        const data = await subCategoriesService.FilterCategory(filter);
    sendResponse(res, data, "Sub category Successfully", 200);
  })
);
subCategoriesController.patch(
  "/:id",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await subCategoriesService.Update(req.body, id);
    sendResponse(res, data, "Update Sub category Successfully", 201);
  })
);
subCategoriesController.delete(
  "/:id",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const data = await subCategoriesService.Delete({
      id,
    });
    sendResponse(res, data, "Deleted Sub category Successfully", 201);
  })
);
