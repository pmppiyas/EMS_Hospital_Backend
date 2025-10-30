import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env").toString() });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET as string,
  BCRYPT: {
    SALTNUMBER: process.env.SALTNUMBER,
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
  },
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  STRIPE: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SUCCESS_URL: process.env.SUCCESS_URL,
    CANCEL_URL: process.env.CANCEL_URL,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  },

  REDIS: {
    DB_NAME: process.env.REDIS_DB_NAME,
    DB_PASS: process.env.REDIS_DB_PASS,
    DB_HOST: process.env.REDIS_HOST,
    DB_PORT: process.env.REDIS_PORT,
  },
};
