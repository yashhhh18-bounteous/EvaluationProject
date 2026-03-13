"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  ShoppingBag, Heart, ShoppingCart, Star, ArrowLeft,
  Package, Shield, RotateCcw, Truck, Tag, ChevronRight,
  Minus, Plus, User, Loader2
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const API = "http://localhost:5000"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: number
  rating: number
  comment: string
  reviewerName: string
  createdAt: string
}

interface ProductImage {
  id: number
  url: string
  productId: number
}

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  weight: number
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  tags: string[]
  thumbnail: string
  category: { id: number; name: string; slug: string }
  images: ProductImage[]
  reviews: Review[]
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#8a7f78]/10">
      <div className="flex items-center gap-4 px-6 py-3.5 max-w-[1200px] mx-auto">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#059669]/60 text-[#059669]">
            <ShoppingBag size={15} />
          </div>
          <span
            className="text-xl tracking-[0.14em] text-[#f5f0eb]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Yash<span className="text-[#059669]">Cart</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 ml-4 text-[#8a7f78]">
          <Link href="/explore" className="text-xs font-light hover:text-[#f5f0eb] transition-colors">
            Explore
          </Link>
          <ChevronRight size={12} />
          <span className="text-xs font-light text-[#f5f0eb]/50">Product</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/explore">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5 gap-1.5 text-xs font-light"
            >
              <ArrowLeft size={14} />
              Back
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              size="sm"
              className="rounded-xl bg-[#059669] text-white hover:bg-[#e8845a] border-0 text-xs font-medium gap-1.5"
            >
              <ShoppingCart size={13} />
              Cart
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function PDPSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-2xl bg-[#e8e3dd]" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-20 rounded-xl bg-[#e8e3dd]" />
          ))}
        </div>
      </div>
      <div className="space-y-5 pt-2">
        <Skeleton className="h-3 w-24 bg-[#e8e3dd]" />
        <Skeleton className="h-10 w-3/4 bg-[#e8e3dd]" />
        <Skeleton className="h-4 w-32 bg-[#e8e3dd]" />
        <Skeleton className="h-8 w-28 bg-[#e8e3dd]" />
        <Skeleton className="h-px w-full bg-[#e8e3dd]" />
        <Skeleton className="h-20 w-full bg-[#e8e3dd]" />
        <Skeleton className="h-12 w-full bg-[#e8e3dd]" />
        <Skeleton className="h-12 w-full bg-[#e8e3dd]" />
      </div>
    </div>
  )
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= Math.round(rating)
              ? "text-[#059669] fill-[#059669]"
              : "text-[#e8e3dd] fill-[#e8e3dd]"
          }
        />
      ))}
    </div>
  )
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e8e3dd] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center text-[#059669]">
            <User size={15} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#0a0a0f]">{review.reviewerName}</p>
            <p className="text-[11px] text-[#8a7f78] font-light">{date}</p>
          </div>
        </div>
        <StarRow rating={review.rating} size={12} />
      </div>
      <p className="text-[13px] font-light text-[#0a0a0f]/70 leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}

// ─── Info Pill ────────────────────────────────────────────────────────────────

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#e8e3dd]">
      <div className="mt-0.5 text-[#059669] flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a7f78]">{label}</p>
        <p className="text-[13px] font-light text-[#0a0a0f] mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [wished, setWished] = useState(false)
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    axios
      .get(`${API}/products/${id}`)
      .then((r) => {
        setProduct(r.data.data ?? r.data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // All images = thumbnail + extra images
  const allImages = product
    ? [product.thumbnail, ...product.images.map((i) => i.url)].filter(Boolean)
    : []

  const discountedPrice = product?.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null

  const avgRating =
    product?.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : product?.rating ?? 0

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {loading && <PDPSkeleton />}

      {error && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
            <Package size={28} />
          </div>
          <p
            className="text-2xl font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Product not found
          </p>
          <Link href="/explore">
            <Button variant="outline" className="rounded-xl border-[#e8e3dd] text-[#0a0a0f] hover:bg-[#059669] hover:text-white hover:border-[#059669] transition-all">
              Back to Explore
            </Button>
          </Link>
        </div>
      )}

      {!loading && !error && product && (
        <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-16">

          {/* ── Top: Image + Details ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: Image Gallery */}
            <div className="space-y-4 lg:sticky lg:top-24">

              {/* Main image */}
              <div className="relative aspect-square bg-white rounded-2xl border border-[#e8e3dd] overflow-hidden group">
                <img
                  src={allImages[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Discount badge */}
                {product.discountPercentage > 5 && (
                  <div className="absolute top-4 left-4 bg-[#059669] text-white text-xs font-medium px-3 py-1 rounded-full">
                    -{Math.round(product.discountPercentage)}% OFF
                  </div>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => setWished((w) => !w)}
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    wished
                      ? "bg-[#059669] text-white"
                      : "bg-white text-[#8a7f78] hover:text-[#059669]"
                  }`}
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 h-20 w-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                        activeImage === i
                          ? "border-[#059669] shadow-md shadow-[#059669]/20"
                          : "border-[#e8e3dd] hover:border-[#059669]/40"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#8a7f78] font-light">
                <Link href="/explore" className="hover:text-[#059669] transition-colors capitalize">
                  {product.category.name}
                </Link>
                <ChevronRight size={11} />
                <span className="text-[#0a0a0f]/40 truncate max-w-[200px]">{product.title}</span>
              </div>

              {/* Brand */}
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669]">
                {product.brand}
              </p>

              {/* Title */}
              <h1
                className="text-[clamp(28px,4vw,42px)] font-light leading-tight text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.title}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3">
                <StarRow rating={avgRating} size={15} />
                <span className="text-sm font-light text-[#0a0a0f]">
                  {avgRating.toFixed(1)}
                </span>
                <Separator orientation="vertical" className="h-4 bg-[#e8e3dd]" />
                <span className="text-sm font-light text-[#8a7f78]">
                  {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
                </span>
                <Separator orientation="vertical" className="h-4 bg-[#e8e3dd]" />
                <Badge
                  className={`text-[10px] font-medium rounded-full px-2.5 border-0 ${
                    product.availabilityStatus === "In Stock"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {product.availabilityStatus}
                </Badge>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-[clamp(32px,4vw,44px)] font-light text-[#0a0a0f] leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  ${discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
                </span>
                {discountedPrice && (
                  <>
                    <span className="text-lg font-light text-[#8a7f78] line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-[#059669]">
                      Save ${(product.price - discountedPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <Separator className="bg-[#e8e3dd]" />

              {/* Description */}
              <p className="text-[14px] font-light text-[#0a0a0f]/65 leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={12} className="text-[#8a7f78]" />
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e8e3dd] text-[#8a7f78] font-light capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <Separator className="bg-[#e8e3dd]" />

              {/* Qty + Add to Cart */}
              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#0a0a0f]/50">
                  Quantity
                  {product.minimumOrderQuantity > 1 && (
                    <span className="ml-2 normal-case tracking-normal text-[#059669] font-light">
                      (min. {product.minimumOrderQuantity})
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-3">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-[#e8e3dd] rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(product.minimumOrderQuantity, q - 1))}
                      className="h-11 w-11 flex items-center justify-center text-[#8a7f78] hover:text-[#0a0a0f] hover:bg-[#faf7f3] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-light text-[#0a0a0f]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="h-11 w-11 flex items-center justify-center text-[#8a7f78] hover:text-[#0a0a0f] hover:bg-[#faf7f3] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="text-[12px] font-light text-[#8a7f78]">
                    {product.stock} in stock
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
                      hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#059669]/30
                      active:translate-y-0 transition-all duration-200 group gap-2"
                  >
                    {addedToCart ? (
                      <>✓ Added to Cart</>
                    ) : (
                      <>
                        <ShoppingCart size={15} className="transition-transform group-hover:scale-110" />
                        Add to Cart · ${((discountedPrice ?? product.price) * qty).toFixed(2)}
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setWished((w) => !w)}
                    variant="outline"
                    className={`h-12 w-12 rounded-xl border transition-all duration-200 flex-shrink-0 ${
                      wished
                        ? "bg-[#059669] border-[#059669] text-white"
                        : "border-[#e8e3dd] text-[#8a7f78] hover:border-[#059669] hover:text-[#059669]"
                    }`}
                  >
                    <Heart size={16} fill={wished ? "currentColor" : "none"} />
                  </Button>
                </div>
              </div>

              {/* Meta info pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <InfoPill icon={<Truck size={14} />} label="Shipping" value={product.shippingInformation} />
                <InfoPill icon={<Shield size={14} />} label="Warranty" value={product.warrantyInformation} />
                <InfoPill icon={<RotateCcw size={14} />} label="Returns" value={product.returnPolicy} />
                <InfoPill icon={<Package size={14} />} label="SKU" value={product.sku} />
              </div>
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
                  Customer Reviews
                </p>
                <h2
                  className="text-[32px] font-light text-[#0a0a0f] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  What people are{" "}
                  <em style={{ fontStyle: "italic" }}>saying</em>
                </h2>
              </div>

              {/* Aggregate rating */}
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span
                  className="text-5xl font-light text-[#0a0a0f]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {avgRating.toFixed(1)}
                </span>
                <StarRow rating={avgRating} size={14} />
                <span className="text-[11px] font-light text-[#8a7f78]">
                  {product.reviews.length} reviews
                </span>
              </div>
            </div>

            <Separator className="bg-[#e8e3dd]" />

            {product.reviews.length === 0 ? (
              <div className="flex flex-col items-center py-16 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
                  <Star size={20} />
                </div>
                <p className="text-sm font-light text-[#8a7f78]">No reviews yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}