import { ADMIN_ROLE } from "@/common/interfaces/user";
import { sendResponse } from "@/common/utils/response";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";
import { NextFunction, Router, Request, Response } from "express";
import { MethodsRepository } from "./repository";
import prisma from "@/lib/prisma";
import { MethodsService } from "./service";
import {
  CreateMethod,
  FilterMethod,
  UpdateMethods,
} from "@/common/interfaces/methods";

const MethodRepository = new MethodsRepository(prisma);
const Service = new MethodsService(MethodRepository);
export const MethodsRoutes: Router = Router();
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

MethodsRoutes.post('/', ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]), asyncHandler(async (req: Request, res: Response) => {
  const data: CreateMethod = req.body
  const response = await Service.Create(data)
  if (!response) {
    sendResponse(res, null, "Failed To Create Methods", 500)
  }
  sendResponse(res, response, "Created Methods Successfully", 201);
}))

MethodsRoutes.post(
  "/",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const data: CreateMethod = req.body;
    const response = await Service.Create(data);

    if (!response) {
      sendResponse(res, null, "Failed To Create Methods", 500);
    }
    sendResponse(res, response, "Created Methods Successfully", 201);
  })
);


MethodsRoutes.patch(
  "/:id",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const data: UpdateMethods = req.body;
    const id = req.params.id;
    const response = await Service.Update(data, parseInt(id));
    if (!response) {
      sendResponse(res, null, "Failed To Update Methods", 500);
    }
    sendResponse(res, response, "Updated Methods Successfully", 204);
  })
);

MethodsRoutes.delete(
  "/:id",
  ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const response = await Service.Delete({
      id: parseInt(id),
    });
    if (!response) {
      sendResponse(res, null, "Failed To Delete Methods", 500);
    }
    sendResponse(res, response, "Deleted Methods Successfully", 201);
  })
);
MethodsRoutes.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const filter: FilterMethod = {
      type: req.query.type as string,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      isActive: req.query.active ? true : false,
      code: (req.query.code as string) ?? "",
      isAll: req.query.isAll as string,
    };
    console.log(filter);
    const response = await Service.FindAll({
      ...filter,
    });

    if (!response) {
      sendResponse(res, null, "Failed To Received Methods", 500);
    }

    sendResponse(res, response, "Send Methods Successfully", 200);
  })
);
