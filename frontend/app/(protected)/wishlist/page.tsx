"use client"

import Link from "next/link"
import { ShoppingBag, Heart, ShoppingCart, Star, Trash2 } from "lucide-react"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import Navbar from "@/components/navbar/Navbar"



// ─── Wishlist Card ────────────────────────────────────────────────────────────

function WishlistCard({ item }: { item: any }) {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const addToCart = useCartStore((s) => s.addToCart)

const { product, productId } = item

if (!product) return null

const discounted = product.discountPercentage
  ? product.price * (1 - product.discountPercentage / 100)
  : null

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#e8e3dd] hover:border-[#059669]/30 hover:shadow-xl hover:shadow-[#059669]/8 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2">

      {/* Image */}
      <div className="relative aspect-square bg-[#faf7f3] overflow-hidden">
        <Link href={`/products/${productId}`} className="block w-full h-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Remove from wishlist */}
        <button
          onClick={() => toggleWishlist(productId)}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-[#059669] text-white
            flex items-center justify-center shadow-lg shadow-[#059669]/30
            hover:bg-red-500 active:scale-75 transition-all duration-200"
        >
          <Heart size={14} fill="#059669" stroke="white" />
        </button>

        {/* Discount badge */}
        {product.discountPercentage && product.discountPercentage > 5 && (
          <div className="absolute top-3 left-3 bg-[#059669] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#059669]/70">
          {product.brand}
        </p>

        <Link href={`/products/${productId}`}>
          <h3
            className="text-[15px] font-light text-[#0a0a0f] leading-snug line-clamp-2 hover:text-[#059669] transition-colors duration-200"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={
                    s <= Math.round(product.rating)
                      ? "text-[#059669] fill-[#059669]"
                      : "text-[#e8e3dd] fill-[#e8e3dd]"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-[#8a7f78] font-light">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span
              className="text-lg font-medium text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ${discounted ? discounted.toFixed(2) : product.price.toFixed(2)}
            </span>
            {discounted && (
              <span className="text-xs text-[#8a7f78] line-through font-light">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(productId)}
            className="h-8 w-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] flex items-center justify-center
              hover:bg-[#059669] active:scale-90 transition-all duration-200"
          >
            <ShoppingCart size={13} />
          </button>
        </div>

        {/* Remove text link */}
        <button
          onClick={() => toggleWishlist(productId)}
          className="flex items-center gap-1.5 text-[11px] font-light text-[#8a7f78] hover:text-red-500 transition-colors pt-1"
        >
          <Trash2 size={11} />
          Remove from wishlist
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
              Your
            </p>
            <h1
              className="text-[clamp(32px,4vw,52px)] font-light leading-tight text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Wish<em style={{ fontStyle: "italic" }}>list</em>
            </h1>
          </div>

          {items.length > 0 && (
            <p className="text-sm font-light text-[#8a7f78] mb-2">
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-5">
            <div className="h-20 w-20 rounded-2xl bg-white border border-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
              <Heart size={32} />
            </div>
            <div className="text-center space-y-1">
              <p
                className="text-2xl font-light text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your wishlist is <em style={{ fontStyle: "italic" }}>empty</em>
              </p>
              <p className="text-sm font-light text-[#8a7f78]">
                Save items you love while you browse
              </p>
            </div>
            <Link href="/explore">
              <Button className="h-11 px-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium
                hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#059669]/30 transition-all duration-200">
                Start Exploring
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <WishlistCard key={item.productId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}