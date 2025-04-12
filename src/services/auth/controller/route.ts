import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";
import { UserRepository } from "../repository/user-repository";
import { SessionRepository } from "../repository/session-repository";
import { VerificationTokenRepository } from "../repository/verificationToken-repository";
import { sendResponse } from "@/common/utils/response";
import { APP_DOMAIN } from "@/common/constants";

// Inisialisasi repositories dan service
const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();
const authService = new AuthService(userRepo, sessionRepo);

// Buat router
const authRoutes = Router();

// Handler untuk menangkap error
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route untuk registrasi
authRoutes.post("/register", asyncHandler(async (req: Request, res: Response) => {
  const { username, whatsApp, password, name } = req.body;
  

  const user = await authService.register(
    { username, whatsApp, password, name }, 
  );
  
  sendResponse(res,user,"User created Successfully",201)
}));

// Route untuk login
authRoutes.post("/login", asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const requestInfo = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || ''
  };
  
  const result = await authService.login({ username, password }, requestInfo);
  
  res.cookie('session_token', result.sessionToken, {
    httpOnly: true,
    domain : APP_DOMAIN as string,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000
  });
  
  sendResponse(res,result,"Login Successfully",200)
}));




export default authRoutes;