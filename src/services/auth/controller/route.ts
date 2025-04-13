import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";
import { UserRepository } from "../repository/user-repository";
import { sendResponse } from "@/common/utils/response";
import { AuthContextManager, ContextAwareMiddleware, RequestAuthContext } from "@/middleware/middleware-auth";
import { ERROR_CODES } from "@/common/constants/error";
import { ConfigEnv } from "@/config/env";

// Inisialisasi repositories dan service
const userRepo = new UserRepository();
const authContextManager = new AuthContextManager()
const authService = new AuthService(userRepo,authContextManager);

// Buat router
const authRoutes = Router();

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

authRoutes.post("/login", asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    const requestInfo = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || ''
    };
    
    const result = await authService.login({ username, password }, requestInfo);
    
    res.cookie('session_token', result.token, {
      httpOnly: true,
      domain : ConfigEnv("development").APP_DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000
    });
    
    sendResponse(res,result,"Login Successfully",200)
  }));

authRoutes.post('/refresh-token', asyncHandler(async (req : Request, res : Response, next : NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      sendResponse(res,null,ERROR_CODES.NOT_FOUND,404)
    }
    
    const newToken = await authService.refreshToken(token);
    sendResponse(res,newToken,"Refresh Token Successfully",200)
  } catch (error) {
    next(error);
  }
}))

authRoutes.post('/logout', ContextAwareMiddleware.authMiddleware,asyncHandler( async (req : Request, res : Response, next : NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      await authService.logout(token);
    }
    sendResponse(res,null,"Logout Successfully",201)
  } catch (error) {
    next(error);
  }
}))

authRoutes.get('/profile', ContextAwareMiddleware.authMiddleware,asyncHandler(async(req : Request, res : Response) => {
  const authContext = (req as RequestAuthContext).authContext;
  return res.json({ user: authContext });
}))



export default authRoutes;