import {prisma} from "../lib/prisma";

export async function getWishlist(userId: number) {
  return prisma.wishlistItem.findMany({
    where: {
      userId,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addToWishlist(
  userId: number,
  productId: number
) {
  return prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {},
    create: {
      userId,
      productId,
    },
  });
}

export async function removeFromWishlist(
  userId: number,
  productId: number
) {
  return prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function toggleWishlist(
  userId: number,
  productId: number
) {
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { wished: false };
  }

  await prisma.wishlistItem.create({
    data: {
      userId,
      productId,
    },
  });

  return { wished: true };
}