import { Router } from "express"
import * as cartController from "../controllers/cart.controller"
import {authMiddleware} from "../middleware/authMiddleware"

const router = Router()

// protect all cart routes
router.use(authMiddleware)

// GET /api/cart
router.get("/", cartController.getCart)

// POST /api/cart/add
router.post("/add", cartController.addToCart)

// PATCH /api/cart/update
router.patch("/update", cartController.updateCartItem)

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", cartController.removeCartItem)

// DELETE /api/cart/clear
router.delete("/clear", cartController.clearCart)

export default router