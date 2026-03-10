import { Request, Response } from "express"
import {prisma} from "../lib/prisma"
import { hashPassword } from "../utils/hash"
import { comparePassword } from "../utils/hash"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"
import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"
import { AuthRequest } from "../middleware/authMiddleware"

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    })

    res.json({
      message: "User created",
      userId: user.id
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}




export const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const valid = await comparePassword(password, user.passwordHash)

    if (!valid) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    const tokenHash = await bcrypt.hash(refreshToken, 10)

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })

    res.json({
      accessToken
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}




export const refresh = async (req: Request, res: Response) => {
  try {

    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ message: "No refresh token" })
    }

    const payload = jwt.verify(token, process.env.REFRESH_SECRET!) as any

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: payload.userId }
    })

    let matchedToken = null

    for (const t of tokens) {
      const valid = await bcrypt.compare(token, t.tokenHash)
      if (valid) {
        matchedToken = t
        break
      }
    }

    if (!matchedToken) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    await prisma.refreshToken.delete({
      where: { id: matchedToken.id }
    })

    const newAccessToken = generateAccessToken(payload.userId)
    const newRefreshToken = generateRefreshToken(payload.userId)

    const tokenHash = await bcrypt.hash(newRefreshToken, 10)

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })

    res.json({
      accessToken: newAccessToken
    })

  } catch (error) {
    console.error(error)
    res.status(403).json({ message: "Invalid refresh token" })
  }
}


export const logout = async (req: Request, res: Response) => {

  const token = req.cookies.refreshToken

  if (token) {

    const tokens = await prisma.refreshToken.findMany()

    for (const t of tokens) {
      const valid = await bcrypt.compare(token, t.tokenHash)

      if (valid) {
        await prisma.refreshToken.delete({
          where: { id: t.id }
        })
      }
    }

  }

  res.clearCookie("refreshToken")

  res.json({ message: "Logged out" })
}

export const me = async (req: AuthRequest, res: Response) => {
  try {

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    res.json(user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

