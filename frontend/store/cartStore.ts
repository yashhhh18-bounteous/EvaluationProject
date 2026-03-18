import { create } from "zustand"
import { getCart, addToCart, updateCart, removeCartItem } from "@/lib/cartApi"

interface CartItem {
  productId: number
  quantity: number
  product: any
}

interface CartState {
  items: CartItem[]
  cartCount: number
  loading: boolean

  fetchCart: () => Promise<void>
  addToCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartCount: 0,
  loading: false,

fetchCart: async () => {
  set({ loading: true })

  const cart = await getCart()

  const items = cart?.items ?? []

  const cartCount = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  )

  set({
    items,
    cartCount,
    loading: false
  })
},

addToCart: async (productId: number) => {

  // optimistic update (fast UI)
  const items = get().items
  const existing = items.find(i => i.productId === productId)

  let updated

  if (existing) {
    updated = items.map(i =>
      i.productId === productId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )
  } else {
    updated = [...items, { productId, quantity: 1, product: null }]
  }

  set({
    items: updated,
    cartCount: updated.reduce((s,i)=>s+i.quantity,0)
  })

  try {
    await addToCart(productId, 1)

    // IMPORTANT: resync with backend
    await get().fetchCart()

  } catch (err) {
    console.error("Cart sync failed", err)
  }
},

updateQuantity: async (productId: number, quantity: number) => {
  
  const optimistic = get().items.map(i =>
    i.productId === productId ? { ...i, quantity } : i
  )
  set({
    items: optimistic,
    cartCount: optimistic.reduce((s, i) => s + i.quantity, 0),
  })

  try {
    await updateCart(productId, quantity)
    await get().fetchCart() // background resync
  } catch (err) {
    console.error("Cart update failed", err)
    await get().fetchCart() // rollback via resync on error
  }
},

removeItem: async (productId: number) => {
  // Optimistic update — remove immediately
  const optimistic = get().items.filter(i => i.productId !== productId)
  set({
    items: optimistic,
    cartCount: optimistic.reduce((s, i) => s + i.quantity, 0),
  })

  try {
    await removeCartItem(productId)
    await get().fetchCart() // background resync
  } catch (err) {
    console.error("Cart remove failed", err)
    await get().fetchCart() // rollback on error
  }
}))


