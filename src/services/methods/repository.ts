import { ERROR_CODES } from "@/common/constants/error";
import {
  CreateMethod,
  DeleteMethods,
  FilterMethod,
  UpdateMethods,
} from "@/common/interfaces/methods";
import { ApiError } from "@/common/utils/apiError";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class MethodsRepository {
  private prisma;

  constructor(prismaClient = prisma) {
    this.prisma = prismaClient;
  }
  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ApiError(
            409,
            ERROR_CODES.CONFLICT,
            "Methods With Code Already exists"
          );
        case "P2025":
          throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Category not found");
        default:
          throw new ApiError(
            500,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "Database operation failed"
          );
      }
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(
        500,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Unexpected server error"
      );
    }
  }
  async Create(req: CreateMethod) {
    try {
      return await this.prisma.method.create({
        data: {
          ...req,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  async update(req: UpdateMethods, id: number) {
    try {
      return await this.prisma.method.update({
        where: {
          id,
        },
        data: {
          ...req,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async FindAll(req: FilterMethod) {
    try {
      const where: Prisma.MethodWhereInput = {};
      const { code, isActive } = req;
      if (code) {
        where.OR = [
          {
            code: {
              contains: code,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: code,
              mode: "insensitive",
            },
          },
        ];
      }

      if (isActive) {
        where.isActive = isActive;
      }

      if (req.type) {
        where.tipe = req.type;
      }

      if (req.isAll === "ALL") {
        return await prisma.method.findMany({
          where,
        });
      }
      const page = req.page || 1;
      const limit = req.limit || 10;
      const skip = (page - 1) * limit;
      const [total, data] = await Promise.all([
        this.prisma.method.count({ where }),
        this.prisma.method.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);
      return {
        methods: data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async GetMethod(code: string) {
    try {
      return await prisma.method.findFirst({
        where: {
          code,
        },
        select: {
          code: true,
          name: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async Delete(req: DeleteMethods) {
    try {
      return await this.prisma.method.delete({
        where: {
          id: req.id,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}
