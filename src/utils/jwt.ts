import jwt from "jsonwebtoken";

export const createAccessToken = (user_id: string) => {
  return jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "30s",
  });
};

export const createRefreshToken = (user_id: string) => {
  return jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
