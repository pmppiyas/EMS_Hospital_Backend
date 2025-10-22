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
};
