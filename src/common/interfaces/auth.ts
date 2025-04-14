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