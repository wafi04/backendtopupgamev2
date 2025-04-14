import { ERROR_CODES } from "@/common/constants/error";
import { CreateCategory, CreateSubCategories, DeleteSubcategory, FilterSubcategory, UpdateCategory, UpdateSubCategory } from "@/common/interfaces/categories";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class SubCategoryRepositories {
    private prisma;
    
    constructor(prismaClient = prisma) {
        this.prisma = prismaClient;
    }
    private  handlePrismaError(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              throw new ApiError(409, ERROR_CODES.CONFLICT, "SubCategory With Code Already exists");
            case 'P2025':
              throw new ApiError(404, ERROR_CODES.NOT_FOUND, "SubCategory not found");
            default:
              throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database operation failed");
          }
        } else if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Unexpected server error");
        }
      }

    async Create(req : CreateSubCategories){
        try {
            return await this.prisma.subCategory.create({
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        } 
    }


    async Update(req : UpdateSubCategory,subCategoryId : number){
        try {
            return await this.prisma.subCategory.update({
                where : {
                    id : subCategoryId
                },
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }


    async FindSubCategory(req: FilterSubcategory) {
        try {
            const where: Prisma.SubCategoryWhereInput = {}
            
            if (req.active !== undefined) {
                where.active = req.active
            }
            
            if (req.search) {
                where.OR = [
                    { code: { contains: req.search, mode: 'insensitive' } },
                    { name: { contains: req.search, mode: 'insensitive' } }
                ]
            }

            if (req.categoryId) {
                where.categoryId = req.categoryId
            }

            

            const page = req.page || 1
            const limit = req.limit || 10
            const skip = (page - 1) * limit

            const [total, data] = await Promise.all([
                this.prisma.subCategory.count({ where }),
                this.prisma.subCategory.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        category: true
                    }
                })
            ])

            return {
                data,
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

    async Delete(req : DeleteSubcategory){
        try {
            return await  this.prisma.subCategory.delete({
                where : {
                    id : req.id
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }

}