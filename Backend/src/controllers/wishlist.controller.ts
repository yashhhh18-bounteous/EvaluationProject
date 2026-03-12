import { Response } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
import * as wishlistService from "../services/wishlist.services"

// GET /wishlist
export async function getWishlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!

    const wishlist = await wishlistService.getWishlist(userId)

    return res.json({
      success: true,
      data: wishlist
    })
  } catch (error) {
    console.error("Get Wishlist Error:", error)
    return res.status(500).json({
      message: "Failed to fetch wishlist"
    })
  }
}

// POST /wishlist/add
export async function addToWishlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        message: "productId is required"
      })
    }

    const item = await wishlistService.addToWishlist(
      userId,
      Number(productId)
    )

    return res.json({
      success: true,
      data: item
    })
  } catch (error) {
    console.error("Add Wishlist Error:", error)
    return res.status(500).json({
      message: "Failed to add wishlist item"
    })
  }
}

// DELETE /wishlist/remove/:productId
export async function removeFromWishlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const productId = Number(req.params.productId)

    const result = await wishlistService.removeFromWishlist(
      userId,
      productId
    )

    return res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Remove Wishlist Error:", error)
    return res.status(500).json({
      message: "Failed to remove wishlist item"
    })
  }
}

// POST /wishlist/toggle
export async function toggleWishlist(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        message: "productId is required"
      })
    }

    const result = await wishlistService.toggleWishlist(
      userId,
      Number(productId)
    )

    return res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Toggle Wishlist Error:", error)
    return res.status(500).json({
      message: "Failed to toggle wishlist"
    })
  }
}