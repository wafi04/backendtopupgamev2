export type ROLE_USER = "Member" | "Admin"  | "Platinum" 
export const EXPIRES_DATE_TOKEN = new Date(Date.now() + 24 * 60 * 60 * 1000);
export const URL_WHATSAPP = "http://103.127.98.128:4000"
export const APP_DOMAIN = process.env.DOMAIN