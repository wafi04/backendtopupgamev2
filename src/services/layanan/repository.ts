import { ERROR_CODES_PRISMA } from "@/common/constants/erorr-prisma";
import { ERROR_CODES } from "@/common/constants/error";
import { CreateProduct, FilterProduct, UpdateProduct } from "@/common/interfaces/product";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class LayananRepository {
    private prisma;
    
    constructor(prismaClient = prisma) {
        this.prisma = prismaClient;
    }
    private handlePrismaError(error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case ERROR_CODES_PRISMA.CONFLICT:
              throw new ApiError(409, ERROR_CODES.CONFLICT, "Resource already exists");
            case ERROR_CODES_PRISMA.NOT_FOUND:
              throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Resource not found");
            case ERROR_CODES_PRISMA.FOREIGN_KEY:
              throw new ApiError(400, ERROR_CODES.BAD_REQUEST, "Invalid reference to related resource");
            case ERROR_CODES_PRISMA.REQUIRED_FIELD:
              throw new ApiError(400, ERROR_CODES.BAD_REQUEST, "Required field missing");
            default:
              throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database operation failed");
          }
        } else if (error instanceof ApiError) {
          throw error;
        } else {
          throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Unexpected server error");
        }
      }
      

  
    async Create(req : CreateProduct){
        try {
            return await prisma.product.create({
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }


    async updateLayanan(req : UpdateProduct,id : number){
        try {
            return await prisma.product.update({
                where : {
                    id
                },
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }


    async DeleteLayanan(id : number){
        try {
            return await prisma.product.delete({
                where : {
                    id 
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }

    async FindById(id : number){
        try {
            return await prisma.product.findUnique({
                where : {
                    id
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }
    async FindAll(req: FilterProduct) {
        try {
            const where: Prisma.ProductWhereInput = {};
            const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
            
            if (req.search) {
                where.OR = [
                    { name: { contains: req.search, mode: 'insensitive' } },
                    { provider: { contains: req.search, mode: 'insensitive' } },
                    { providerId: { contains: req.search, mode: 'insensitive' } }
                ];
            }
            
            // Handle flashSale filter
            if (req.isFlashSale) {
                where.isFlashSale = req.isFlashSale === 'ACTIVE';
                
                if (req.isFlashSale === 'ACTIVE') {
                    where.flashSaleUntil = {
                        gt: new Date() 
                    };
                }
            }
            
            // Handle status filter
            if (req.status) {
                where.status = req.status === 'ACTIVE';
            }
            
            // Handle category filter
            if (req.categoryId) {
                where.categoryId = req.categoryId;
            }
            
            if (req.sortPriceDesc) {
                orderBy.push({ price: 'desc' });
            } else if (req.sortPriceAsc) {
                orderBy.push({ price: 'asc' });
            } else {
                orderBy.push({ updatedAt: 'desc' });
            }
            
            // Handle pagination
            const page = req.page ?? 1;
            const perPage = req.perPage ?? 10;
            const skip = (page - 1) * perPage;
            
            // Execute the query
            const [data, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    orderBy: orderBy.length > 0 ? orderBy : undefined,
                    skip,
                    take: perPage,
                    include: {
                        category: true,
                        subCategory: true
                    }
                }),
                this.prisma.product.count({ where })
            ]);
            
            return {
                data,
                meta: {
                    page,
                    perPage,
                    total,
                    totalPages: Math.ceil(total / perPage)
                }
            };
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

}