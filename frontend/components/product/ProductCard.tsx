"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"

import { Product } from "@/types/product"

import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"

export default function ProductCard({ product, index }: { product: Product; index: number }) {

  const addToCart = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)

  // ✅ Select `items` (the actual array in your store) so Zustand re-renders
  // the card whenever the array reference changes on toggle.
  // isWishlisted uses get() internally — stable function ref, no re-render.
  const items = useWishlistStore((s) => s.items)
  const wished = items.some((i) => i.productId === product.id)

  const discounted = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8e3dd] hover:border-[#c8622a]/30 hover:shadow-xl hover:shadow-[#c8622a]/8 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#faf7f3] overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className={[
            "absolute top-3 right-3 z-10",
            "h-8 w-8 rounded-full",
            "flex items-center justify-center",
            "transition-all duration-200 active:scale-75",
            // color — wished vs not wished
            wished
              ? "bg-[#c8622a] text-white shadow-lg shadow-[#c8622a]/30"
              : "bg-white/80 text-[#8a7f78] hover:bg-white hover:text-[#c8622a]",
            // visibility — kept separate so Tailwind doesn't conflict
            wished
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
          ].join(" ")}
        >
          <Heart
            size={14}
            fill={wished ? "currentColor" : "none"}
            className={`transition-transform duration-200 ${wished ? "scale-110" : "scale-100"}`}
          />
        </button>

        {/* Discount badge */}
        {product.discountPercentage && product.discountPercentage > 5 && (
          <div className="absolute top-3 left-3 bg-[#c8622a] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#c8622a]/70">
          {product.brand}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3
            className="text-[15px] font-light text-[#0a0a0f] leading-snug line-clamp-2 hover:text-[#c8622a] transition-colors duration-200"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={
                  s <= Math.round(product.rating)
                    ? "text-[#c8622a] fill-[#c8622a]"
                    : "text-[#e8e3dd] fill-[#e8e3dd]"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-[#8a7f78] font-light">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price + Cart */}
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart(product.id)
            }}
            className="h-8 w-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] flex items-center justify-center
              hover:bg-[#c8622a] active:scale-90 transition-all duration-200"
          >
            <ShoppingCart size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}