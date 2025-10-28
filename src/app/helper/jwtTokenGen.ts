import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";

export const jwtTokenGen = async (payload: { email: string; role: string }) => {
  const accessToken = jwt.sign(
    { email: payload.email, role: payload.role },
    ENV.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "5h",
    }
  ) as SignOptions;

  const refreshToken = jwt.sign(
    { email: payload.email, role: payload.role },
    ENV.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};
