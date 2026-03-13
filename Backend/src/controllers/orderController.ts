import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { AuthRequest } from "../middleware/authMiddleware"

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId } = req.body

    // get address
    const address = await prisma.address.findFirst({
      where: { id: Number(addressId), userId: req.userId }
    })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    // get cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: { product: true }
        }
      }
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

    // create order
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
      },
      include: { items: true }
    })

    // clear cart after order
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    res.json(order)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    })

    res.json(orders)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findFirst({
      where: { id: Number(id), userId: req.userId },
      include: { items: true }
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}