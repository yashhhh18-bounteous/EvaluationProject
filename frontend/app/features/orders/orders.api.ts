import { api } from "@/lib/api"

export const createCheckoutSession = async (addressId: number) => {
  const res = await api.post("/api/payments/create-checkout-session", { addressId })
  return res.data
}

export const verifySession = async (sessionId: string) => {
  const res = await api.get(`/api/payments/verify-session/${sessionId}`)
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