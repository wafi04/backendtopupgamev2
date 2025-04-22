import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES, ErrorCode } from "./error";

export const ERROR_CODES_PRISMA = {
  NOT_FOUND: "P2025",
  CONFLICT: "P2002",
  FOREIGN_KEY: "P2003",
  REQUIRED_FIELD: "P2011",
  INVALID_DATA: "P2000",
  CONSTRAINT_VIOLATION: "P2004",
  FIELD_NOT_FOUND: "P2009",
  INTERNAL_ERROR: "P2010",
  TOO_MANY_RECORDS: "P2015",
  MULTIPLE_RECORDS: "P2034",
  CONNECTION_ERROR: "P1001",
  TIMEOUT: "P1008",
  DB_ALREADY_EXISTS: "P1009",
  MIGRATION_ERROR: "P3000",
  MIGRATION_IN_PROGRESS: "P3001",
  MIGRATION_NOT_FOUND: "P3002",
  INTROSPECTION_ERROR: "P4000",
  UNKNOWN_ERROR: "P5000",
  INVALID_CONNECTION: "P5004",
  QUERY_PARSING_ERROR: "P6000"
} as const;

export type PrismaErrorCode = keyof typeof ERROR_CODES_PRISMA;
export type PrismaErrorType = typeof ERROR_CODES_PRISMA[PrismaErrorCode];

export type ErrorDB = {
  code: PrismaErrorType;
  message: string;
  meta?: Record<string, unknown>;
  target?: string[];
};

type ErrorMapping = {
  [K in PrismaErrorCode]?: {
    status: number;
    message: string | ((meta: Record<string, unknown>) => string);
  };
};

const DEFAULT_ERROR_MAPPING: ErrorMapping = {
  NOT_FOUND: {
    status: 404,
    message: "Resource not found"
  },
  CONFLICT: {
    status: 409,
    message: (meta) => `Conflict on fields: ${(meta?.target as string[] || []).join(', ')}`
  },
  FOREIGN_KEY: {
    status: 400,
    message: "Foreign key constraint failed"
  },
  REQUIRED_FIELD: {
    status: 400,
    message: "Required field missing"
  },
  INVALID_DATA: {
    status: 400,
    message: "Invalid data provided"
  }
};

const PRISMA_TO_APP_ERROR_MAP: Record<PrismaErrorCode, ErrorCode> = {
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  FOREIGN_KEY: "BAD_REQUEST",
  REQUIRED_FIELD: "VALIDATION_ERROR",
  INVALID_DATA: "VALIDATION_ERROR",
  CONSTRAINT_VIOLATION: "BAD_REQUEST",
  FIELD_NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_SERVER_ERROR",
  TOO_MANY_RECORDS: "CONFLICT",
  MULTIPLE_RECORDS: "CONFLICT",
  QUERY_PARSING_ERROR: "BAD_REQUEST",
  DB_ALREADY_EXISTS: "CONFLICT",
  MIGRATION_NOT_FOUND: "NOT_FOUND",
  MIGRATION_ERROR: "DB_ERROR",
  MIGRATION_IN_PROGRESS: "DB_ERROR",
  INVALID_CONNECTION: "DB_ERROR",
  CONNECTION_ERROR: "DB_ERROR",
  TIMEOUT: "DB_ERROR",
  INTROSPECTION_ERROR: "INTERNAL_SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
};

export class PrismaErrorHandler {
  private customMappings: ErrorMapping;

  constructor(customMappings: ErrorMapping = {}) {
    this.customMappings = { ...DEFAULT_ERROR_MAPPING, ...customMappings };
  }

  handle(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.handlePrismaError(error);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid input data");
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new ApiError(500, "DB_INIT_ERROR", "Database connection failed");
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new ApiError(500, "DB_PANIC", "Database unreachable");
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, "UNKNOWN_ERROR", "Unexpected server error");
    }
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): never {
    const prismaErrorCode = Object.entries(ERROR_CODES_PRISMA).find(
      ([, code]) => code === error.code
    )?.[0] as PrismaErrorCode | undefined;

    if (!prismaErrorCode) {
      throw new ApiError(
        500,
        "UNKNOWN_ERROR",
        `Database operation failed: ${error.message}`,
        error.meta
      );
    }

    const mapping = this.customMappings[prismaErrorCode] || {
      status: 500,
      message: `Database error: ${error.message}`
    };

    const message = typeof mapping.message === 'function'
      ? mapping.message(error.meta || {})
      : mapping.message;

    const appErrorCode = PRISMA_TO_APP_ERROR_MAP[prismaErrorCode];

    throw new ApiError(
      mapping.status,
      appErrorCode,
      message,
      error.meta
    );
  }
}