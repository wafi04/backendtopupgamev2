import { CreateUser, LoginData, UserData } from "@/common/interfaces/user";
import { SessionRepository } from "../repository/session-repository";
import { UserRepository } from "../repository/user-repository";
import { ApiError } from "@/common/utils/apiError";
import { ERROR_CODES } from "@/common/constants/error";
import { GenerateId } from "@/common/utils/generate";
import { HashingPassword, VerifyPassword } from "../repository/helpers";
import { AuthContextManager } from "@/middleware/middleware-auth";

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private authContextManager : AuthContextManager
  ) {}

  async register(createData: CreateUser): Promise<UserData> {
    try {
      const existingUser = await this.userRepo.getUserByUsername(createData.username);
      if (existingUser) {
        throw new ApiError(400, ERROR_CODES.CONFLICT, "Username already exists");
      }
      const  hashedPassword = await HashingPassword(createData.password)
      return await this.userRepo.createUser({
        ...createData,
        password : hashedPassword as string
      });
    } catch (error) {
      throw error;
    }
  }
  async login(
    loginData: LoginData,
    requestInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ user: UserData; token: string }> {
    try {
      const user = await this.userRepo.getUserByUsername(loginData.username);
      if (!user) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Username atau password tidak valid");
      }
      
      const passwordMatch = await VerifyPassword(loginData.password, user.password as string);
      if (!passwordMatch) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Username atau password tidak valid");
      }
      const sessionId = GenerateId("SESS")
      
      // Buat JWT token dengan context
      const token = await this.authContextManager.createSessionWithContext(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          emailVerified: user.isEmailVerified,
        },
        {
          ...requestInfo,
          sessionId
        }
      );
      
      const userResponse = { ...user };
      delete userResponse.password;
      
      return {
        user: userResponse,
        token
      };
    } catch (error) {
      throw error;
    }
  }
  
  async refreshToken(token: string): Promise<string> {
    try {
      return await this.authContextManager.refreshToken(token);
    } catch (error) {
      throw error;
    }
  }
  
  async logout(token: string): Promise<void> {
    try {
     
      const sessionRepo = new SessionRepository();
      await sessionRepo.revokeSession(token);
    } catch (error) {
      throw error;
    }
  }
}