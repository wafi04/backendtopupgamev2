import { APP_DOMAIN } from "@/common/constants";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

export type TYPE_ENV = "development" | "production" | "test";

export const ConfigEnv = (
  name: TYPE_ENV = (process.env.NODE_ENV as TYPE_ENV) || "development"
) => {
  let envFile = ".env";

  if (name === "development") {
    envFile = ".env.local";
  } else if (name === "production") {
    envFile = ".env.production";
  } else if (name === "test") {
    envFile = ".env.test";
  }

  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn(`File ${envFile} tidak ditemukan, menggunakan nilai default`);
  }

  // Config untuk development
  if (name === "development") {
    return {
      PORT: process.env.PORT as string,
      DATABASE_URL: process.env.DATABASE_URL as string,
      JWT_SECRET: process.env.JWT_SECRET as string,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
      JWT_ISSUER: process.env.JWT_ISSUER as string,
      APP_DOMAIN,
      DIGI_API_KEY: process.env.DIGI_API_KEY as string,
      DIGI_USERNAME: process.env.DIGI_USERNAME as string,
      REDIS_URL: process.env.REDIS_URL as string,
    };
  }

  if (name === "production") {
    return {
      PORT: process.env.PORT as string,
      DATABASE_URL: process.env.DATABASE_URL as string,
      JWT_SECRET: process.env.JWT_SECRET as string,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
      JWT_ISSUER: process.env.JWT_ISSUER as string,
      APP_DOMAIN,
      DIGI_API_KEY: process.env.DIGI_API_KEY as string,
      DIGI_USERNAME: process.env.DIGI_USERNAME as string,
      REDIS_URL: process.env.REDIS_URL as string,
    };
  }

  // Config untuk test
  if (name === "test") {
    return {
      PORT: process.env.PORT || 8080,
      DATABASE_URL:
        process.env.DATABASE_URL ||
        "postgresql://username:password@localhost:5432/mydb_test",
      JWT_SECRET: process.env.JWT_SECRET || "test_secret",
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
      JWT_ISSUER: process.env.JWT_ISSUER || "wafiuddinwafiq-test",
    };
  }

  throw new Error(`Environment ${name} tidak valid`);
};
