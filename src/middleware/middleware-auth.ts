import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SessionRepository } from '@/services/auth/repository/session-repository';
import { ApiError } from '@/common/utils/apiError';
import { ERROR_CODES } from '@/common/constants/error';
import { sendResponse } from '@/common/utils/response';
import { ConfigEnv } from '@/config/env';

const config = ConfigEnv();

export interface AuthContext {
  userId: number;
  username: string;
  role: string;
  emailVerified: boolean;
  sessionId : string
  iat?: number;
  exp?: number;
}

export interface RequestAuthContext extends Request{
    authContext: {
        username: string;
        sessionId : string
        userId: number;
        role: string;
        emailVerified: boolean;
   }
}

export class AuthContextManager {
  private sessionRepo: SessionRepository;
  private jwtSecret: string;
  private jwtExpiresIn: number

  constructor() {
    this.sessionRepo = new SessionRepository();
    this.jwtSecret = config.JWT_SECRET;
    this.jwtExpiresIn = parseInt(config.JWT_EXPIRES_IN);
  }

  // Mendapatkan konteks dari token JWT
  async getContextFromToken(token: string): Promise<AuthContext> {
      try {
        
      // Verifikasi dan decode token JWT
      const decoded = jwt.verify(token, this.jwtSecret) as AuthContext;
    
      return {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        sessionId : decoded.sessionId,
        emailVerified: decoded.emailVerified
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, ERROR_CODES.SESSION_EXPIRED, "Token telah kedaluwarsa");
      }
      throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Token tidak valid");
    }
  }

  // Generate JWT token dengan context
  generateTokenWithContext(context: Partial<AuthContext>): string {
    const payload = {
      userId: context.userId,
        username: context.username,
      sessionId : context.sessionId,
      role: context.role,
      emailVerified: context.emailVerified
    };
    
    return jwt.sign(
      payload,
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn, }
    );
  }

  // Membuat session baru dengan konteks dan JWT
  async createSessionWithContext(
    context: Partial<AuthContext>,
    requestInfo?: { ipAddress?: string; userAgent?: string,    sessionId : string },
  ): Promise<string> {
    // Generate JWT token
      const jwtToken = this.generateTokenWithContext({
          ...context,
          sessionId : requestInfo?.sessionId
    });
    
      await this.sessionRepo.createSession({
        userId: context.userId as number,
        sessionToken: jwtToken,
        ipAddress: requestInfo?.ipAddress || '',
        userAgent: requestInfo?.userAgent || '',
    },requestInfo?.sessionId as string);
    
    return jwtToken;
  }

  // Method untuk memng konteks ke requestasa
  static async attachContextToRequest(req: Request, token: string): Promise<void> {
    const authManager = new AuthContextManager();
    try {
      const context = await authManager.getContextFromToken(token);
      
      // Tambahkan konteks ke request object
      (req as RequestAuthContext).authContext = context;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string): Promise<{
    valid: boolean;
    expired: boolean;
    context?: AuthContext;
  }> {
    try {
      // Verify the token
      const context = await this.getContextFromToken(token);
      
      // Check if session is still valid in database
      const isSessionValid = await this.sessionRepo.validateSession(context.sessionId);
      if (!isSessionValid) {
        return { valid: false, expired: false };
      }
      
      return { valid: true, expired: false, context };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorCode === ERROR_CODES.SESSION_EXPIRED) {
          return { valid: false, expired: true };
        }
      }
      return { valid: false, expired: false };
    }
  }

  // Refresh token
  async refreshToken(token: string): Promise<string> {
    try {
      // Decode token tanpa verifikasi untuk mendapatkan userId
      const decoded = jwt.decode(token) as AuthContext;
      
      if (!decoded || !decoded.userId) {
        throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Token tidak valid");
      }
      
      // Verifikasi token
      jwt.verify(token, this.jwtSecret);

      await this.sessionRepo.updateToken(decoded.sessionId, token);
      
      // Buat token baru dengan data yang sama
      return this.generateTokenWithContext({
        userId: decoded.userId,
          username: decoded.username,
        sessionId : decoded.sessionId,
        role: decoded.role,
        emailVerified: decoded.emailVerified
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Token sudah expired, tapi kita masih bisa refresh jika belum terlalu lama
        const decoded = jwt.decode(token) as AuthContext;
        
        if (!decoded || !decoded.userId) {
          throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Token tidak valid");
        }
        
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExpiry = decoded.exp || 0;
        
        const refreshWindow = 7 * 24 * 60 * 60; 
        
        if (currentTime - tokenExpiry <= refreshWindow) {
          return this.generateTokenWithContext({
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
            sessionId : decoded.sessionId,
            emailVerified: decoded.emailVerified
          });
        }
      }
      
      throw new ApiError(401, ERROR_CODES.UNAUTHORIZED, "Token tidak dapat di-refresh");
    }
  }
}

export class ContextAwareMiddleware {
  static async authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.session_token;
  
  if (!token) {
    return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
  }
  
  try {
    await AuthContextManager.attachContextToRequest(req, token);
    next();
  } catch (error) {
    return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
  }
}
  
  static roleMiddleware(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.session_token;
      
      if (!token) {
        return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
      }

      try {
        await AuthContextManager.attachContextToRequest(req, token);
        const authContext = (req as RequestAuthContext).authContext;

        if (!authContext) {
          return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
        }
        
        if (!roles.includes(authContext.role)) {
          return sendResponse(res, null, ERROR_CODES.FORBIDDEN, 403);
        }
        
        next();
      } catch (error) {
        return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
      }
    };
  }
}