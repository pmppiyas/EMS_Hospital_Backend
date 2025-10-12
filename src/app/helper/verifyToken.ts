import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env";
export const verifyToken = (tokan: string) => {
  return jwt.verify(tokan, ENV.JWT_SECRET) as JwtPayload;
};
