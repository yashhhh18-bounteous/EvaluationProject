import { Request, Response } from "express"
import Stripe from "stripe"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/authMiddleware"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000"

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId } = req.body

    // validate address
    const address = await prisma.address.findFirst({
      where: { id: Number(addressId), userId: req.userId }
    })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    // get cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } }
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price
      return sum + price * item.quantity
    }, 0)

    const shipping = subtotal > 500 ? 0 : 20
    const total = subtotal + shipping

    // create pending order first
    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        addressLine1: address.line1,
        addressLine2: address.line2 ?? null,
        addressCity: address.city,
        addressState: address.state,
        addressPincode: address.pincode,
        addressCountry: address.country,
        subtotal,
        shipping,
        total,
        status: "PENDING",
        paymentStatus: "unpaid",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            title: item.product.title,
            thumbnail: item.product.thumbnail,
            price: item.product.discountPercentage
              ? item.product.price * (1 - item.product.discountPercentage / 100)
              : item.product.price,
            quantity: item.quantity
          }))
        }
      }
    })

    // build stripe line items
    const lineItems = cart.items.map((item) => {
      const price = item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
            images: [item.product.thumbnail],
          },
          unit_amount: Math.round(price * 100), // stripe uses cents
        },
        quantity: item.quantity,
      }
    })

    // add shipping as line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            images: [],
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/order-cancel?order_id=${order.id}`,
      metadata: {
        orderId: String(order.id),
        userId: String(req.userId),
      }
    })

    // save session id to order
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    })

    res.json({ url: session.url, orderId: order.id })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature failed", err)
    return res.status(400).json({ message: "Webhook error" })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = Number(session.metadata?.orderId)

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "paid",
        stripeSessionId: session.id,
        stripePaymentIntentId: String(session.payment_intent)
      }
    })

    // clear cart
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (order) {
      const cart = await prisma.cart.findUnique({ where: { userId: order.userId } })
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = Number(session.metadata?.orderId)

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", paymentStatus: "failed" }
    })
  }

  res.json({ received: true })
}

export const verifySession = async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = req.params.sessionId as string

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId,
        userId: req.userId
      },
      include: { items: true }
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({ session, order })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}