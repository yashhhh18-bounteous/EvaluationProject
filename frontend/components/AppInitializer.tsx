"use client"

import { useEffect } from "react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"

export default function AppInitializer() {

  const fetchCart = useCartStore((s) => s.fetchCart)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)

  useEffect(() => {
    fetchCart()
    fetchWishlist()
  }, [])

  return null
}