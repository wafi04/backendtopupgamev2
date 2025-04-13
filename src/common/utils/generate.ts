import { createHash, randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

// Fungsi untuk generate API key
export function GenerateApiKey(): string {
  return randomBytes(32).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
}
export function GenerateId(prefix?: string): string {
    const timestamp = Date.now();
  return `${prefix ?? "VAZZ"}${timestamp}`
}

export function GenerateUniqueString(length: number = 16): string {
  const timestamp = Date.now().toString(36);
  const randomStr = randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  return `${timestamp}-${randomStr}`;
}

// Fungsi untuk generate random token
export function generateRandomToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

// Fungsi untuk generate session token dengan data user
export function generateSessionToken(
  userId?: string, 
  username?: string, 
  role?: string, 
  isEmailVerified?: boolean
): string {
  const randomPart = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  
  if (userId) {
    const userInfo = [userId, username, role, isEmailVerified].filter(Boolean).join('-');
    const dataToHash = `${userInfo}-${timestamp}-${randomPart}`;
    return createHash('sha256').update(dataToHash).digest('hex');
  }
  
  return createHash('sha256').update(`${timestamp}-${randomPart}`).digest('hex');
}

// Fungsi password hashing
export async function HashingPassword(password: string, saltRounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

// Fungsi verifikasi password
export async function VerifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}