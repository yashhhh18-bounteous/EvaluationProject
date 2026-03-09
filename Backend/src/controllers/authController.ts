import { Request, Response } from "express"
import {prisma} from "../lib/prisma"
import { hashPassword } from "../utils/hash"
import { comparePassword } from "../utils/hash"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt"

import bcrypt from "bcrypt"

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