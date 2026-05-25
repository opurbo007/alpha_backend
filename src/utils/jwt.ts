import jwt, { Secret, SignOptions } from "jsonwebtoken";

const accessTokenSecret: Secret = process.env.JWT_SECRET!;
const refreshTokenSecret: Secret = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId }, accessTokenSecret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId }, refreshTokenSecret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
};
