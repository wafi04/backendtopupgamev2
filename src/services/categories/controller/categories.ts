import { CategoriesService } from "../service/categories";
import { Request, Response, Router, RequestHandler, NextFunction } from "express";
import { CategoriesRepository } from "../repository/categories";
import { ContextAwareMiddleware } from "@/middleware/middleware-auth";

import { ADMIN_ROLE } from "@/common/interfaces/user";
import { sendResponse } from "@/common/utils/response";

const CategoriesRoute: Router = Router()

const catRepo = new CategoriesRepository()
const catService = new CategoriesService(catRepo)
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
CategoriesRoute.post('/', ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]) as RequestHandler, asyncHandler(async(req: Request, res: Response) => {
    const data = await catService.Create(req.body)
    sendResponse(res,data,"Create Category Successfully",201)
}))
CategoriesRoute.put('/:id', ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]) as RequestHandler, asyncHandler(async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const data = await catService.Update(req.body, id)
    sendResponse(res, data, "Update Category Successfully", 200)
}))
CategoriesRoute.delete('/:id', ContextAwareMiddleware.roleMiddleware([ADMIN_ROLE]) as RequestHandler, asyncHandler(async(req: Request, res: Response) => {
    const data = await catService.Remove({
        id : parseInt(req.params.id)
    })
    sendResponse(res,data,"Delete Category Successfully",201)
}))

CategoriesRoute.get('/', asyncHandler(async(req: Request, res: Response) => {
    const filter = {
        type : req.query.type  as string,
        search: req.query.search as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        active: req.query.active as string,
        status: req.query.status as string
    }
    const data = await catService.FilterCategory(filter)
    sendResponse(res, data, "Get Categories Successfully", 200)
}))

export default CategoriesRoute
