import { prisma } from "@/lib/prisma";
import { ERROR_CODES } from "@/common/constants/error";
import { CreateSessions, Sessions } from "@/common/interfaces/sessions";
import { ApiError } from "@/common/utils/apiError";
import { Prisma } from "@prisma/client";
import { EXPIRES_DATE_TOKEN } from "@/common/constants";

export class SessionRepository {
  private  handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ApiError(409, ERROR_CODES.CONFLICT, "Session token already exists");
        case 'P2025':
          throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Session not found");
        default:
          throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database operation failed");
      }
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Unexpected server error");
    }
  }

   async createSession(data: CreateSessions): Promise<Sessions> {
    try {
      const session = await prisma.session.create({
        data: {
          expires: EXPIRES_DATE_TOKEN,
          sessionToken: data.sessionToken,
          ipAddress: data.ipAddress,
          userId: data.userId,
          userAgent: data.userAgent
        },
      });

      return this.formatSessionResponse(session);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

   async getSession(sessionToken: string): Promise<Sessions> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      });

      if (!session) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Invalid session token");
      }

      if (session.expires < new Date()) {
        await this.revokeSession(session.id);
        throw new ApiError(401, ERROR_CODES.SESSION_EXPIRED, "Session has expired");
      }

      return this.formatSessionResponse(session);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

   async revokeSession(sessionId: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { id: sessionId }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

   async revokeAllSessions(userId: number): Promise<{ count: number }> {
    try {
      return await prisma.session.deleteMany({
        where: { userId }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private  formatSessionResponse(session: any): Sessions {
    if (!session) {
      throw new ApiError(404, ERROR_CODES.NOT_FOUND, "Session data is empty");
    }

    return {
      id: session.id,
      sessionToken: session.sessionToken,
      userId: session.userId,
      expires: session.expires.toISOString(),
      ipAddress: session.ipAddress || undefined,
      userAgent: session.userAgent || undefined,
      createdAt: session.createdAt.toISOString(),
    };
  }

   async validateSession(sessionToken: string): Promise<boolean> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        select: { expires: true }
      });

      return !!session && session.expires > new Date();
    } catch (error) {
      return false;
    }
  }
}