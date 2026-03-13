// features/orders/orders.mutations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { placeOrder, fetchOrders, fetchOrderById } from "./orders.api"

export function usePlaceOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: number) => placeOrder(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    }
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