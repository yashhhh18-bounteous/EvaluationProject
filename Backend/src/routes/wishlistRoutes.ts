import { Router } from "express"
import * as wishlistController from "../controllers/wishlist.controller"
import {authMiddleware} from "../middleware/authMiddleware"

const router = Router()

// protect wishlist routes
router.use(authMiddleware)

// GET /api/wishlist
router.get("/", wishlistController.getWishlist)

// POST /api/wishlist/add
router.post("/add", wishlistController.addToWishlist)

// DELETE /api/wishlist/remove/:productId
router.delete("/remove/:productId", wishlistController.removeFromWishlist)

// POST /api/wishlist/toggle
router.post("/toggle", wishlistController.toggleWishlist)

export default router