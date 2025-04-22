import { PrismaErrorHandler } from "@/common/constants/erorr-prisma";
import {
  CreateSubCategories,
  DeleteSubcategory,
  FilterSubcategory,
  UpdateSubCategory,
} from "@/common/interfaces/categories";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class SubCategoryRepositories {
  private prisma;
  private prismaErrorHandler: PrismaErrorHandler;

  constructor(prismaClient = prisma) {
    this.prisma = prismaClient;
      this.prismaErrorHandler = new PrismaErrorHandler({
       CONFLICT: {
         status: 409,
         message: " Sub Category with code already exists"
       },
       NOT_FOUND: {
         status: 404,
         message: "Sub Category not found"
       }
     });
  }
 
   
 
   private handlePrismaError(error: unknown): never {
     return this.prismaErrorHandler.handle(error);
   }

  async Create(req: CreateSubCategories) {
    try {
      return await this.prisma.subCategory.create({
        data: {
          ...req,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async Update(req: UpdateSubCategory, subCategoryId: number) {
    try {
      return await this.prisma.subCategory.update({
        where: {
          id: subCategoryId,
        },
        data: {
          ...req,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async FindSubCategory(req: FilterSubcategory) {
    try {
      const where: Prisma.SubCategoryWhereInput = {};

      if (typeof req.active === "boolean") {
      where.active = req.active;
    }

      if (req.search) {
        where.OR = [
          { code: { contains: req.search, mode: "insensitive" } },
          { name: { contains: req.search, mode: "insensitive" } },
        ];
      }

      if (req.categoryId) {
        where.categoryId = req.categoryId;
      }

      const page = req.page || 1;
      const limit = req.limit || 10;
      const skip = (page - 1) * limit;

      const [total, data] = await Promise.all([
        this.prisma.subCategory.count({ where }),
        this.prisma.subCategory.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log(error)
      this.handlePrismaError(error);
    }
  }

  async Delete(req: DeleteSubcategory) {
    try {
      return await this.prisma.subCategory.delete({
        where: {
          id: req.id,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
