import { create } from "zustand"
import { getWishlist, toggleWishlist as toggleWishlistAPI } from "@/lib/wishlistApi"

interface WishlistItem {
  productId: number
  product?: any
}

interface WishlistState {
  items: WishlistItem[]
  wishlistCount: number

  fetchWishlist: () => Promise<void>
  toggleWishlist: (productId: number) => Promise<void>
  isWishlisted: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({

  items: [],
  wishlistCount: 0,

  fetchWishlist: async () => {
    const items = await getWishlist()

    set({
      items,
      wishlistCount: items.length
    })
  },

  toggleWishlist: async (productId: number) => {

    const items = get().items
    const exists = items.some(i => i.productId === productId)

    // OPTIMISTIC UPDATE
    if (exists) {
      const updated = items.filter(i => i.productId !== productId)

      set({
        items: updated,
        wishlistCount: updated.length
      })

    } else {
      const updated = [...items, { productId }]

      set({
        items: updated,
        wishlistCount: updated.length
      })
    }

    // API CALL (background)
    try {
      await toggleWishlistAPI(productId)
    } catch (err) {
      console.error("Wishlist sync failed", err)
    }
  },

  isWishlisted: (productId: number) => {
    return get().items.some(i => i.productId === productId)
  }

}))