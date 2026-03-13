import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCheckoutSession,
  verifySession,
  fetchOrders,
  fetchOrderById
} from "./orders.api"

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (addressId: number) => createCheckoutSession(addressId)
  })
}

export function useVerifySession(sessionId: string) {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => verifySession(sessionId),
    enabled: !!sessionId
  })
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders
  })
}

export function useOrderById(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id
  })
}