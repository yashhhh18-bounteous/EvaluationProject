import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.REFRESH_SECRET!

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "15m"
  })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d"
  })
}