import { ERROR_CODES } from "../constants/error";


export class ApiError extends Error {
    constructor(
      public statusCode: number,
      public errorCode: keyof typeof ERROR_CODES,
      message: string,
      public details?: any
    ) {
      super(message);
      Object.setPrototypeOf(this, ApiError.prototype);
    }
  
    toJSON() {
      return {
        error: {
          code: this.errorCode,
          message: this.message,
          details: this.details,
          statusCode: this.statusCode
        }
      };
    }
  }