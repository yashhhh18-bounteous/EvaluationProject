"use client"

import Link from "next/link"
import { ShoppingBag, Trash2, Heart, ShoppingCart, Minus, Plus, ArrowRight, Package } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar/Navbar"

// ─── Navbar ───────────────────────────────────────────────────────────────────



// ─── Cart Item Card ───────────────────────────────────────────────────────────

function CartItemCard({ item }: { item: any }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const wishlistItems = useWishlistStore((s) => s.items)

  const wished = wishlistItems.some((i) => i.productId === item.productId)
const { product, quantity } = item

// guard if product is missing
if (!product) return null

const discounted = product.discountPercentage
  ? product.price * (1 - product.discountPercentage / 100)
  : null

  const unitPrice = discounted ?? product.price
  const lineTotal = unitPrice * quantity

  const handleMoveToWishlist = () => {
    toggleWishlist(item.productId)
    removeItem(item.productId)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8e3dd] p-5 flex gap-5 items-start group hover:border-[#059669]/20 hover:shadow-md hover:shadow-[#059669]/5 transition-all duration-300">

      {/* Thumbnail */}
      <Link href={`/products/${item.productId}`} className="flex-shrink-0">
        <div className="h-24 w-24 rounded-xl bg-[#faf7f3] border border-[#e8e3dd] overflow-hidden flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#059669]/70">
          {product.brand}
        </p>
        <Link href={`/products/${item.productId}`}>
          <h3
            className="text-[15px] font-light text-[#0a0a0f] leading-snug hover:text-[#059669] transition-colors line-clamp-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {product.title}
          </h3>
        </Link>

        {/* Unit price */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-light text-[#0a0a0f]">
            ${unitPrice.toFixed(2)}
          </span>
          {discounted && (
            <span className="text-xs text-[#8a7f78] line-through font-light">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-[10px] text-[#8a7f78] font-light">each</span>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 pt-2 flex-wrap">

          {/* Qty stepper */}
          <div className="flex items-center border border-[#e8e3dd] rounded-xl overflow-hidden bg-[#faf7f3]">
            <button  disabled={quantity === 1 }
             onClick={() => {
        if (quantity === 1) {
    removeItem(item.productId)
    
  } else {
    updateQuantity(item.productId, quantity - 1)
  }
           }}
              className="h-8 w-8 flex items-center justify-center text-[#8a7f78] hover:text-[#0a0a0f] hover:bg-[#e8e3dd] transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="w-8 text-center text-sm font-light text-[#0a0a0f]">
              {quantity}
              
            </span>
            <button
              onClick={() => updateQuantity(item.productId, quantity + 1)}
              className="h-8 w-8 flex items-center justify-center text-[#8a7f78] hover:text-[#0a0a0f] hover:bg-[#e8e3dd] transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          <Separator orientation="vertical" className="h-5 bg-[#e8e3dd]" />

          {/* Move to wishlist */}
          <button
            onClick={handleMoveToWishlist}
            className={`flex items-center gap-1.5 text-xs font-light transition-colors ${
              wished
                ? "text-[#059669]"
                : "text-[#8a7f78] hover:text-[#059669]"
            }`}
          >
            <Heart
              size={13}
              fill={wished ? "#059669" : "none"}
              stroke={wished ? "white" : "currentColor"}
              className={wished ? "drop-shadow-sm" : ""}
            />
            {wished ? "Wishlisted" : "Move to Wishlist"}
          </button>

          <Separator orientation="vertical" className="h-5 bg-[#e8e3dd]" />

          {/* Remove */}
          <button
            onClick={() => removeItem(item.productId)}
            className="flex items-center gap-1.5 text-xs font-light text-[#8a7f78] hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="flex-shrink-0 text-right">
        <p
          className="text-xl font-light text-[#0a0a0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          ${lineTotal.toFixed(2)}
        </p>
        {quantity > 1 && (
          <p className="text-[11px] text-[#8a7f78] font-light mt-0.5">
            {quantity} × ${unitPrice.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Cart Summary ─────────────────────────────────────────────────────────────

function CartSummary({ items }: { items: any[] }) {

  const router = useRouter()
 const subtotal = items.reduce((sum, item) => {

  if (!item.product) return sum

  const price = item.product.discountPercentage
    ? item.product.price * (1 - item.product.discountPercentage / 100)
    : item.product.price

  return sum + price * item.quantity

}, 0)

  const shipping = subtotal > 500 ? 0 : 20
  const total = subtotal + shipping

  return (
    <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-4 sticky top-24">

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
          Summary
        </p>
        <h2
          className="text-2xl font-light text-[#0a0a0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Order <em style={{ fontStyle: "italic" }}>total</em>
        </h2>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-light text-[#8a7f78]">
            Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
          <span className="text-sm font-light text-[#0a0a0f]">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-light text-[#8a7f78]">Shipping</span>
          {shipping === 0 ? (
            <span className="text-sm font-medium text-emerald-600">Free</span>
          ) : (
            <span className="text-sm font-light text-[#0a0a0f]">${shipping.toFixed(2)}</span>
          )}
        </div>

        {shipping > 0 && (
          <div className="text-[11px] text-[#8a7f78] font-light bg-[#faf7f3] rounded-lg px-3 py-2">
            Add ${(500 - subtotal).toFixed(2)} more for free shipping
          </div>
        )}
      </div>

      <Separator className="bg-[#e8e3dd]" />

      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-[#0a0a0f]">Total</span>
        <span
          className="text-3xl font-light text-[#0a0a0f]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          ${total.toFixed(2)}
        </span>
      </div>

 <Button
  onClick={() => router.push("/checkout")}
  className="w-full h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
    hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#059669]/30
    active:translate-y-0 transition-all duration-200 group gap-2"
>
  Proceed to Checkout
  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
</Button>

      <Link href="/explore">
        <Button
          variant="ghost"
          className="w-full h-10 rounded-xl text-[#8a7f78] hover:text-[#0a0a0f] text-sm font-light"
        >
          Continue Shopping
        </Button>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const items = useCartStore((s) => s.items)

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
            Your
          </p>
          <h1
            className="text-[clamp(32px,4vw,52px)] font-light leading-tight text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Shopping <em style={{ fontStyle: "italic" }}>Cart</em>
          </h1>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-5">
            <div className="h-20 w-20 rounded-2xl bg-white border border-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
              <ShoppingCart size={32} />
            </div>
            <div className="text-center space-y-1">
              <p
                className="text-2xl font-light text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your cart is <em style={{ fontStyle: "italic" }}>empty</em>
              </p>
              <p className="text-sm font-light text-[#8a7f78]">
                Looks like you haven't added anything yet
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* Items list */}
            <div className="space-y-4">
             {items.filter(i => i.product).map((item) => (
  <CartItemCard key={item.productId} item={item} />
))}
            </div>

            {/* Summary */}
            <CartSummary items={items} />
          </div>
        )}
      </div>
    </div>
  )
}