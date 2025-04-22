import { PrismaErrorHandler } from "@/common/constants/erorr-prisma";
import { ERROR_CODES } from "@/common/constants/error";
import {
  CreateCategory,
  DeleteCategory,
  FilterCategory,
  UpdateCategory,
} from "@/common/interfaces/categories";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CategoriesRepository {
  private prismaErrorHandler: PrismaErrorHandler;

  constructor() {
    this.prismaErrorHandler = new PrismaErrorHandler({
      CONFLICT: {
        status: 409,
        message: "Category with code already exists"
      },
      NOT_FOUND: {
        status: 404,
        message: "Category not found"
      }
    });
  }

  private handlePrismaError(error: unknown): never {
    return this.prismaErrorHandler.handle(error);
  }
  async Create(req: CreateCategory) {
    try {
      const checkCode = await this.FindCategoryByCode(req.code);

      if (checkCode) {
        throw new ApiError(
          504,
          "BAD_REQUEST",
          "Category With Kode Alresdy exists"
        );
      }
      const data = await prisma.category.create({
        data: {
          name: req.name,
          subName : req.subName,
          code: req.code,
          description: req.description,
          thumbnail: req.thumbnail,
          status: req.status,
          type: req.type,
          logo: req.logo,
          brand: req.brand,
          placeholder1: req.placeholder1,
          placeholder2: req.placeholder2,
          serverId: req.serverId,
          instructions: req.instructions,
          
        },
      });
      return data;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async FindCategoryByCode(code: string) {
    try {
      return await prisma.category.findUnique({ where: { code: code } });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async UpdateCategory(req: UpdateCategory, id: number) {
    try {
      return await prisma.category.update({
        where: {
          id,
        },
        data: {
          ...req,
        },
      });
    } catch (error) {
      console.log(error)
      this.handlePrismaError(error);
    }
  }

  async DeleteCategories(req: DeleteCategory) {
    try {
      return await prisma.category.delete({
        where: {
          id: req.id,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

 async FilterCategory(req: FilterCategory) {
  try {
    const where: Prisma.CategoryWhereInput = {};
    
    // Add search condition
    if (req.search) {
      where.OR = [
        {
          code: {
            contains: req.search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: req.search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Add type filter
    if (req.type) {
      where.type = req.type;
    }

    // Add active/status filter
    if (req.active) {
      where.status = req.active;
    }

    // Handle 'all' parameter - skip pagination if all is true
    if (req.all) {
      // Fetch all records without pagination
      const data = await prisma.category.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        categories: data,
        meta: {
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1,
        },
      };
    } 
    else {
      const page = req.page || 1;
      const limit = req.limit || 10;
      const skip = (page - 1) * limit;

      const [total, data] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      return {
        categories: data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  } catch (error) {
    console.log(error);
    this.handlePrismaError(error);
  }
}
}
