import { CreateUser, LoginData, UserData } from "@/common/interfaces/user";
import { SessionRepository } from "../repository/session-repository";
import { UserRepository } from "../repository/user-repository";
import { ApiError } from "@/common/utils/apiError";
import { ERROR_CODES } from "@/common/constants/error";
import { generateSessionToken } from "@/common/utils/generate";
import { HashingPassword, VerifyPassword } from "../repository/helpers";

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
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
  async login(loginData: LoginData, requestInfo?: { ipAddress?: string, userAgent?: string }): Promise<{ user: UserData, sessionToken: string }> {
    try {
      const user = await this.userRepo.getUserByUsername(loginData.username);
      if (!user) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Invalid username or password");
      }

      const passwordMatch = await VerifyPassword(loginData.password, user.password as string);
      if (!passwordMatch) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Invalid username or password");
      }

      const sessionToken = generateSessionToken(user.id.toString(),user.username,user.role,user.isEmailVerified);
      await this.sessionRepo.createSession({
        userId: user.id,
        sessionToken: sessionToken,
        ipAddress: requestInfo?.ipAddress || '',
        userAgent: requestInfo?.userAgent || '',
      });

      const userResponse = { ...user };
      delete userResponse.password;

      return {
        user: userResponse,
        sessionToken: sessionToken
      };
    } catch (error) {
      throw error;
    }
  }
}