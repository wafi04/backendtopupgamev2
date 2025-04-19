import { ERROR_CODES } from "@/common/constants/error";
import prisma from "@/lib/prisma";
import { ApiError } from "@/common/utils/apiError";
import { Prisma } from "@prisma/client";

export class VerificationTokenRepository {
  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ApiError(
            409,
            ERROR_CODES.CONFLICT,
            "Verification token already exists"
          );
        case "P2025":
          throw new ApiError(
            404,
            ERROR_CODES.NOT_FOUND,
            "Verification token not found"
          );
        default:
          throw new ApiError(
            500,
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "Database operation failed"
          );
      }
    }
    throw error;
  }

  async createToken(data: {
    identifier: string;
    token: string;
    expires: Date;
    type: string;
    otp?: string;
    username: string;
  }) {
    try {
      return await prisma.verificationToken.create({
        data: {
          identifier: data.identifier,
          token: data.token,
          expires: data.expires,
          type: data.type,
          otp: data.otp,
          username: data.username,
        },
        select: {
          identifier: true,
          token: true,
          expires: true,
          type: true,
          createdAt: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getTokenByIdentifier(identifier: string) {
    try {
      return await prisma.verificationToken.findFirst({
        where: { identifier },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getTokenByUsername(username: string) {
    try {
      return await prisma.verificationToken.findFirst({
        where: { username },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async verifyToken(token: string, otp?: string) {
    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!verificationToken) {
        throw new ApiError(
          404,
          ERROR_CODES.NOT_FOUND,
          "Invalid verification token"
        );
      }

      if (verificationToken.expires < new Date()) {
        throw new ApiError(
          410,
          ERROR_CODES.SESSION_EXPIRED,
          "Verification token has expired"
        );
      }

      if (otp && verificationToken.otp !== otp) {
        throw new ApiError(403, ERROR_CODES.FORBIDDEN, "Invalid OTP code");
      }

      return verificationToken;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteToken(token: string) {
    try {
      return await prisma.verificationToken.delete({
        where: { token },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteExpiredTokens() {
    try {
      return await prisma.verificationToken.deleteMany({
        where: {
          expires: { lt: new Date() },
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async validateToken(token: string, type: string) {
    try {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

      return (
        !!verificationToken &&
        verificationToken.expires > new Date() &&
        verificationToken.type === type
      );
    } catch (error) {
      return false;
    }
  }
}
