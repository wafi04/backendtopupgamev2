import { ERROR_CODES } from "../../../common/constants/error";
import { CreateUser, MEMBER_ROLE, UpdateUser, UserData } from "../../../common/interfaces/user";
import { ApiError } from "../../../common/utils/apiError";
import { GenerateApiKey } from "../../../common/utils/generate";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";


export class UserRepository {
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

  async createUser(data: CreateUser): Promise<UserData> {
    try {
        const findUsername =  await this.getUserByUsername(data.username)
        if(findUsername){
            throw new ApiError(504,"BAD_REQUEST","Username Telah Dipakai")
        }
       return await prisma.user.create({
        data: {
          balance: 0,
          name: data.name,
          password: data.password,
          role: MEMBER_ROLE,
          username: data.username,
          apiKey: GenerateApiKey({}),
          whatsapp: data.whatsApp,
          createdAt: new Date(),
          isDeleted : false,
          updatedAt: new Date()
        },
        select: {
          id: true,
          username: true,
          isEmailVerified : true,
          name: true,
          role: true,
          balance: true,
          whatsapp: true,
          createdAt: true,
          updatedAt : true
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      return await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          balance: true,
          whatsapp: true,
          isEmailVerified : true,
          createdAt: true,
          updatedAt : true,
          password: true
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async deleteUser(username : string){
    try {
        return await prisma.user.update({
            where : {
                username
            },
            data : {
                deletedAt : new Date(),
                isDeleted : true
            }
        })
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
  
  async updateUser(username: string, data: UpdateUser): Promise<UserData> {
    try {
      return await prisma.user.update({
        where: { username },
        data: {
          ...data,
          updatedAt: new Date()
        },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          isEmailVerified : true,
          balance: true,
          updatedAt : true,
          whatsapp: true,
          createdAt: true
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async getUserWithSensitiveData(username: string) {
    try {
      return await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          password: true, 
          apiKey: true
        }
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }
}