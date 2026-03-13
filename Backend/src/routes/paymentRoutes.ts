import { Router } from "express"
import express from "express"
import {
  createCheckoutSession,
  stripeWebhook,
  verifySession
} from "../controllers/paymentController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

// webhook must use raw body — before json middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
)

router.post("/create-checkout-session", authMiddleware, createCheckoutSession)
router.get("/verify-session/:sessionId", authMiddleware, verifySession)

export default router