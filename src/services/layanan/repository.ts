import { ERROR_CODES_PRISMA } from "@/common/constants/erorr-prisma";
import { ERROR_CODES } from "@/common/constants/error";
import { CreateProduct, FilterProduct, FilterProductByCategory, UpdateProduct } from "@/common/interfaces/product";
import { MEMBER_ROLE, PLATINUM_ROLE, RESELLER_ROLE } from "@/common/interfaces/user";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";



export class ProductRepository {
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

    async findProductByCategoryCode(filter: FilterProductByCategory) {
      try {
          const { price, subcategory, role } = filter
          const priceSelect: Prisma.ProductSelect = {
            id: true,
            name: true,
            providerId: true,
            provider: true,
            price: true,
            productImage: true,
            status: true,
          }
         
          if (role === PLATINUM_ROLE) {
            priceSelect.platinumPrice = true;
            priceSelect.regularPrice = true;
          } else if (role === RESELLER_ROLE) {
            priceSelect.resellerPrice = true;
            priceSelect.regularPrice = true;
          } else {
            priceSelect.regularPrice = true;
          }

          
          const orderBy = price === "min" 
            ? { price: 'asc' as const } 
            : price === "max" 
              ? { price: 'desc' as const }
              : undefined
          
          const categoryData = await prisma.category.findUnique({
            where: {
              code: filter.code
            },
            include: {
              products: {
                select: priceSelect,
                where: {
                  status: true
                },
                orderBy: orderBy
              },
              subCategories: true
            }
          })
          
          if (categoryData && subcategory && subcategory !== "all") {
            const filteredProducts = categoryData.products.filter(product => {
              const productCode = product.providerId.toLowerCase()
              const match = productCode.match(/^([a-z]+)/)
              const basePrefix = match ? match[0] : productCode
              
              return basePrefix === subcategory.toLowerCase()
            })
            
            categoryData.products = filteredProducts
          }
          
          return categoryData
        } catch (error) {
          console.log(error)
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
                if (req.isFlashSale) {
                    where.flashSaleUntil = {
                        gt: new Date() 
                    };
                }
            }
            
            
            if (req.status !== undefined) {
               if (typeof req.status === 'string') {
                  where.status = req.status === 'active';
               } else {
                  where.status = req.status;
               }
           }
            
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
            
            const page = req.page ?? 1;
            const perPage = req.perPage ?? 10;
            const skip = (page - 1) * perPage;
            
            const [data, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    orderBy: orderBy.length > 0 ? orderBy : undefined,
                    skip,
                    take: perPage,
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
            console.log(error)
            this.handlePrismaError(error);
        }
    }

}