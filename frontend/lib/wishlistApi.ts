import { api } from "./api"

export async function getWishlist() {
  const res = await api.get("/api/wishlist")
  return res.data.data
}

export async function toggleWishlist(productId: number) {
  const res = await api.post("/api/wishlist/toggle", {
    productId
  })
  return res.data.data
}

export async function removeWishlist(productId: number) {
  const res = await api.delete(`/api/wishlist/remove/${productId}`)
  return res.data.data
}