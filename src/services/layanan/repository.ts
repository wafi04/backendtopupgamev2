import { ERROR_CODES_PRISMA } from "@/common/constants/erorr-prisma";
import { ERROR_CODES } from "@/common/constants/error";
import { CreateLayanan, FilterLayanan, UpdateLayanan } from "@/common/interfaces/layanan";
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
    async Create(req : CreateLayanan){
        try {
            return await prisma.layanan.create({
                data : {
                    ...req
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }


    async updateLayanan(req : UpdateLayanan,id : number){
        try {
            return await prisma.layanan.update({
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
            return await prisma.layanan.delete({
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
            return await prisma.layanan.findUnique({
                where : {
                    id
                }
            })
        } catch (error) {
            this.handlePrismaError(error)
        }
    }
    async FindAll(req: FilterLayanan) {
        try {
            const where: Prisma.LayananWhereInput = {};
            const orderBy: Prisma.LayananOrderByWithRelationInput[] = [];
            
            if (req.search) {
                where.OR = [
                    { layanan: { contains: req.search, mode: 'insensitive' } },
                    { provider: { contains: req.search, mode: 'insensitive' } },
                    { providerId: { contains: req.search, mode: 'insensitive' } }
                ];
            }
            
            // Handle flashSale filter
            if (req.flashSale) {
                where.isFlashSale = req.flashSale === 'ACTIVE';
                
                if (req.flashSale === 'ACTIVE') {
                    where.expiredFlashSale = {
                        gt: new Date() 
                    };
                }
            }
            
            // Handle status filter
            if (req.status) {
                where.status = req.status === 'ACTIVE';
            }
            
            // Handle category filter
            if (req.kategoryId) {
                where.kategoriId = req.kategoryId;
            }
            
            if (req.expensivetocheap) {
                orderBy.push({ harga: 'desc' });
            } else if (req.cheaptoexpensive) {
                orderBy.push({ harga: 'asc' });
            } else {
                orderBy.push({ updatedAt: 'desc' });
            }
            
            // Handle pagination
            const page = req.page ?? 1;
            const perPage = req.perPage ?? 10;
            const skip = (page - 1) * perPage;
            
            // Execute the query
            const [data, total] = await Promise.all([
                this.prisma.layanan.findMany({
                    where,
                    orderBy: orderBy.length > 0 ? orderBy : undefined,
                    skip,
                    take: perPage,
                    include: {
                        category: true,
                        subCategory: true
                    }
                }),
                this.prisma.layanan.count({ where })
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