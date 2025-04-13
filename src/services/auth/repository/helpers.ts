import { ApiError } from '@/common/utils/apiError';
import * as bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @param saltRounds The number of salt rounds to use (default: 10)
 * @returns Promise that resolves to the hashed password
 */
export async function HashingPassword(password: string, saltRounds: number = 10): Promise<string> {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return hashedPassword;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to hash password');
  }
}

/**
 * Verifies a password against a hash
 * @param plainPassword The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns Promise that resolves to a boolean indicating if the password matches
 */
export async function VerifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // Compare the plain password with the hash
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    
    return isMatch;
  } catch (error) {
    throw new ApiError(401,"VALIDATION_ERROR",'Failed to verify password');
  }
}