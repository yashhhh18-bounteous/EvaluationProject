import { Response } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
import * as cartService from "../services/cart.services"

// GET /cart
export async function getCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!

    const cart = await cartService.getCart(userId)

    return res.json({
      success: true,
      data: cart
    })
  } catch (error) {
    console.error("Get Cart Error:", error)
    return res.status(500).json({
      message: "Failed to fetch cart"
    })
  }
}

// POST /cart/add
export async function addToCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({
        message: "productId is required"
      })
    }

    const item = await cartService.addToCart(
      userId,
      Number(productId),
      quantity ?? 1
    )

    return res.json({
      success: true,
      data: item
    })
  } catch (error) {
    console.error("Add To Cart Error:", error)
    return res.status(500).json({
      message: "Failed to add item to cart"
    })
  }
}

// PATCH /cart/update
export async function updateCartItem(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const { productId, quantity } = req.body

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "productId and quantity are required"
      })
    }

    const item = await cartService.updateCartItem(
      userId,
      Number(productId),
      Number(quantity)
    )

    return res.json({
      success: true,
      data: item
    })
  } catch (error) {
    console.error("Update Cart Error:", error)
    return res.status(500).json({
      message: "Failed to update cart item"
    })
  }
}

// DELETE /cart/remove/:productId
export async function removeCartItem(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!
    const productId = Number(req.params.productId)

    const result = await cartService.removeCartItem(userId, productId)

    return res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Remove Cart Error:", error)
    return res.status(500).json({
      message: "Failed to remove cart item"
    })
  }
}

// DELETE /cart/clear
export async function clearCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!

    const result = await cartService.clearCart(userId)

    return res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Clear Cart Error:", error)
    return res.status(500).json({
      message: "Failed to clear cart"
    })
  }
}