export class ApiError extends Error {
    constructor(
      public statusCode: number,
      public errorCode: string,
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