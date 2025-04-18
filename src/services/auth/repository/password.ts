import { ERROR_CODES } from "@/common/constants/error";
import { ApiError } from "@/common/utils/apiError";
import { Prisma } from "@prisma/client";
import { UserRepository } from "./user-repository";
import { sendMessageToQueue } from "@/lib/whatsapp/send";

export class ResetPasswordRepository {
    constructor(
        private authRepository : UserRepository
    ){
    }
    private  handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ApiError(409, ERROR_CODES.CONFLICT, "Username already exists");
        case 'P2025':
          throw new ApiError(404, ERROR_CODES.NOT_FOUND, "User not found");
        default:
          throw new ApiError(500, ERROR_CODES.INTERNAL_SERVER_ERROR, "Database error");
      }
    }
    throw error;
  } 

  async RequestResetPassword(username: string): Promise<void> {
    try {
        const user =  await this.authRepository.getUserByUsername(username)
        if(!username){
            throw new ApiError(404,ERROR_CODES.NOT_FOUND,"Username not found")
        }

        await sendMessageToQueue(user?.whatsapp as string,"")
        
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}