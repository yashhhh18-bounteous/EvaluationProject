import { api } from "./api"

export async function getCart() {
  const res = await api.get("/api/cart")
  return res.data.data
}

export async function addToCart(productId: number, quantity = 1) {
  const res = await api.post("/api/cart/add", {
    productId,
    quantity
  })
  return res.data.data
}

export async function updateCart(productId: number, quantity: number) {
  const res = await api.patch("/api/cart/update", {
    productId,
    quantity
  })
  return res.data.data
}

export async function removeCartItem(productId: number) {
  const res = await api.delete(`/api/cart/remove/${productId}`)
  return res.data.data
}

export async function clearCart() {
  const res = await api.delete("/api/cart/clear")
  return res.data.data
}