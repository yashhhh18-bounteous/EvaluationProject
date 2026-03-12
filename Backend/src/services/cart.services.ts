import {prisma} from "../lib/prisma";

async function ensureCart(userId: number) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  return cart;
}

export async function getCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return { items: [] };
  }

  return cart;
}


export async function addToCart(
  userId: number,
  productId: number,
  quantity: number = 1
) {
  const cart = await ensureCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
}


export async function updateCartItem(
  userId: number,
  productId: number,
  quantity: number
) {
  const cart = await ensureCart(userId);

  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  }

  return prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    data: {
      quantity,
    },
  });
}


export async function removeCartItem(
  userId: number,
  productId: number
) {
  const cart = await ensureCart(userId);

  return prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });
}

export async function clearCart(userId: number) {
  const cart = await ensureCart(userId);

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
}