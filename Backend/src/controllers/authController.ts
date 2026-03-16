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




export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const valid = await comparePassword(password, user.passwordHash)

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" })
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

    // ACCESS TOKEN COOKIE
  const isProd = process.env.NODE_ENV === "production"

res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 15 * 60 * 1000
})

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
})

    return res.json({ success: true })

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

  // auth.controller.ts — refresh endpoint
res.cookie("refreshToken", newRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  maxAge: 7 * 24 * 60 * 60 * 1000  
})

res.cookie("accessToken", newAccessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ← fix sameSite too
  maxAge: 15 * 60 * 1000
})

    res.json({ success: true })

  } catch (error) {
    console.error(error)
    res.status(403).json({ message: "Invalid refresh token" })
  }
}


export const logout = async (req: AuthRequest, res: Response) => {
  const token = req.cookies.refreshToken

  if (token) {
    const tokens = await prisma.refreshToken.findMany({
      where: {userId:req.userId}
    })
    for (const t of tokens) {
      const valid = await bcrypt.compare(token, t.tokenHash)
      if (valid) {
        await prisma.refreshToken.delete({ where: { id: t.id } })
      }
    }
  }

  const isProd = process.env.NODE_ENV === "production"

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" as const : "lax" as const,
  }

  res.clearCookie("accessToken", cookieOptions)
  res.clearCookie("refreshToken", cookieOptions)

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
        phone: true,        // ← ADD
        createdAt: true,
        addresses: {        // ← ADD
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
        }
      }
    })

    res.json(user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// UPDATE PROFILE
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    })

    res.json(user)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// ADD ADDRESS
export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { label, line1, line2, city, state, pincode, country, isDefault } = req.body

    // if new address is default, unset all others first
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.userId },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: req.userId!,
        label, line1, line2,
        city, state, pincode,
        country: country ?? "India",
        isDefault: isDefault ?? false
      }
    })

    res.json(address)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// GET ADDRESSES
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    })

    res.json(addresses)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE ADDRESS
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    // make sure address belongs to this user
    const address = await prisma.address.findFirst({
      where: { id: Number(id), userId: req.userId }
    })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    await prisma.address.delete({ where: { id: Number(id) } })

    res.json({ message: "Address deleted" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}