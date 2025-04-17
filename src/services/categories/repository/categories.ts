import { ERROR_CODES } from "@/common/constants/error";
import { CreateCategory, DeleteCategory, FilterCategory, UpdateCategory } from "@/common/interfaces/categories";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CategoriesRepository  {
    private  handlePrismaError(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              throw new ApiError(409, ERROR_CODES.CONFLICT, "Category With Code Already exists");
            case 'P2025':
              throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Category not found");
            default:
              throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database operation failed");
          }
        } else if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Unexpected server error");
        }
      }
    async Create(req : CreateCategory){
        try {
            const checkCode =  await this.FindCategoryByCode(req.kode)
            
            if(checkCode){
                throw new ApiError(504,"BAD_REQUEST","Category With Kode Alresdy exists")
            }
            const data = await prisma.category.create({
                data : {
                    ...req
                }
            })
            return data
        } catch (error) {
            this.handlePrismaError(error) 
        }
    }

    async FindCategoryByCode(code : string){
        try {
            return await prisma.category.findUnique({where : {code : code}})
        } catch (error) {
            this.handlePrismaError(error)
        }
    }

    async UpdateCategory(req : UpdateCategory,id : number){
        try {
            return await prisma.category.update({
                where : {
                    id,
                },
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }

    async DeleteCategories(req :DeleteCategory){
        try {
            return await prisma.category.delete({
                where : {
                    id : req.id
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }

    async FilterCategory(req : FilterCategory){
        try {
            const where :Prisma.CategoryWhereInput = {}
            if(req.search){
                where.OR = [
                    {
                        code: {
                            contains: req.search,
                            mode: "insensitive"
                        }
                    },
                    {
                        name: {
                            contains: req.search,
                            mode: "insensitive"
                        }
                    }
                ]
            }

            if(req.type){
                where.type= req.type
            }

            if(req.active){
                where.status = req.active
            }

            const page = req.page || 1
            const limit = req.limit || 10
            const skip = (page - 1) * limit

            const [total, data] = await Promise.all([
                prisma.category.count({ where }),
                prisma.category.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            ])

            return {
                categories :data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
            
        } catch (error) {
            this.handlePrismaError(error)
        }
    }
}