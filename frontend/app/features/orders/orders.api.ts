// features/orders/orders.api.ts
import { api } from "@/lib/api"

export const placeOrder = async (addressId: number) => {
  const res = await api.post("/api/orders", { addressId })
  return res.data
}

export const fetchOrders = async () => {
  const res = await api.get("/api/orders")
  return res.data
}

export const fetchOrderById = async (id: number) => {
  const res = await api.get(`/api/orders/${id}`)
  return res.data
}