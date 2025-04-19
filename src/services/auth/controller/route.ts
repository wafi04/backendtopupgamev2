import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";
import { UserRepository } from "../repository/user-repository";
import { sendResponse } from "@/common/utils/response";
import {
  AuthContextManager,
  ContextAwareMiddleware,
  RequestAuthContext,
} from "@/middleware/middleware-auth";
import { ERROR_CODES } from "@/common/constants/error";
import { ConfigEnv } from "@/config/env";
import { send } from "node:process";
import prisma from "@/lib/prisma";
import { SessionRepository } from "../repository/session-repository";

// Inisialisasi repositories dan service
const userRepo = new UserRepository();
const authContextManager = new AuthContextManager();
const sessionRepo = new SessionRepository();
const authService = new AuthService(userRepo, authContextManager, sessionRepo);

// Buat router
const authRoutes = Router();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Route untuk registrasi
authRoutes.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, whatsApp, password, name } = req.body;

    const user = await authService.register({
      username,
      whatsApp,
      password,
      name,
    });

    sendResponse(res, user, "User created Successfully", 201);
  })
);

authRoutes.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const requestInfo = {
      ipAddress:
        req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
        req.headers["x-real-ip"]?.toString() ||
        req.ip ||
        "",
      userAgent: req.headers["user-agent"] || "",
    };

    const result = await authService.login({ username, password }, requestInfo);

    res.cookie("session_token", result.token, {
      httpOnly: true,
      domain: ConfigEnv().APP_DOMAIN,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, result, "Login Successfully", 200);
  })
);

authRoutes.get(
  "/verify",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("Authorization Header:", req.headers.authorization);
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.session_token;
    if (!token) {
      return sendResponse(res, null, ERROR_CODES.UNAUTHORIZED, 401);
    }
    const authManager = new AuthContextManager();
    const result = await authManager.verifyToken(token);
    if (result.valid) {
      return sendResponse(
        res,
        {
          valid: true,
          user: {
            userId: result.context?.userId,
            username: result.context?.username,
            sessionId: result.context?.sessionId,
            role: result.context?.role,
            emailVerified: result.context?.emailVerified,
          },
        },
        "Token is valid",
        200
      );
    } else if (result.expired) {
      return sendResponse(
        res,
        { valid: false, expired: true },
        ERROR_CODES.SESSION_EXPIRED,
        401
      );
    } else {
      return sendResponse(res, { valid: false }, ERROR_CODES.UNAUTHORIZED, 401);
    }
  })
);

authRoutes.post(
  "/refresh-token",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (!token) {
        sendResponse(res, null, ERROR_CODES.NOT_FOUND, 404);
      }

      const newToken = await authService.refreshToken(token);
      sendResponse(res, newToken, "Refresh Token Successfully", 200);
    } catch (error) {
      next(error);
    }
  })
);

authRoutes.post(
  "/logout",
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        await authService.logout(token);
      }
      sendResponse(res, null, "Logout Successfully", 201);
    } catch (error) {
      next(error);
    }
  })
);

authRoutes.get(
  "/sessions",
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const authContext = (req as RequestAuthContext).authContext;
    const sessions = await authService.getAllSessions(authContext.username);
    sendResponse(res, sessions, "Get All Session Successfully", 200);
  })
);

authRoutes.post(
  "/sessions/revoke",
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.body;
    await authService.revokeSessions(sessionId);
    sendResponse(res, null, "Revoke Session Successfully", 200);
  })
);

authRoutes.post(
  "/sessions/revoke-all",
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const authContext = (req as RequestAuthContext).authContext;
    await sessionRepo.revokeAllSessions(authContext.userId);
    sendResponse(res, null, "Revoke All Session Successfully", 200);
  })
);

authRoutes.get(
  "/profile",
  ContextAwareMiddleware.authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const authContext = (req as RequestAuthContext).authContext;
    const user = await userRepo.getUserByUsername(authContext.username);
    return res.json({ user: user });
  })
);

export default authRoutes;
