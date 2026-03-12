import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: number
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any

    req.userId = payload.userId

    next()

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}