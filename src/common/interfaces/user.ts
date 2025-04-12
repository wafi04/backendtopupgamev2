// common/interfaces/user.ts
export interface UserData { 
    name: string; 
    id: number; 
    username: string; 
    isEmailVerified : boolean
    whatsapp: string | null; 
    balance: number; 
    role: string; 
    createdAt: Date | null; 
    updatedAt: Date | null; 
    password? : string
 }
  
  // For create operations
  export interface CreateUser {
    name: string;
    username: string;
    password: string;
    whatsApp?: string;
  }
  
  // For update operations
  export interface UpdateUser {
    name?: string;
    whatsApp?: string;
    balance?: number;
  }

  export type LoginData = {
    username : string
    password : string
  }