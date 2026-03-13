"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { api } from "@/lib/api"
import Navbar from "@/components/navbar/Navbar"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { toast } from "sonner"

import {
  ShoppingBag,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Heart,
} from "lucide-react"

import PDPImageGallery from "@/components/product/PDPImageGallery"
import ReviewCard from "@/components/product/ReviewCard"
import StarRow from "@/components/product/StarRow"
import InfoPill from "@/components/product/InfoPill"
import PDPSkeleton from "@/components/product/PDPSkeleton"

import { Product } from "@/types/productPDP"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"


export default function ProductDetailPage() {


  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const addToCart = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(Number(id) ?? 0))

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    api
      .get(`/products/${id}`)
      .then(r => setProduct(r.data.data ?? r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    try {
      await addToCart(product.id)
      toast.success("Added to cart")
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleToggleWishlist = () => {
    if (!product) return
    toggleWishlist(product.id)
    const nowWishlisted = useWishlistStore.getState().isWishlisted(product.id)
    toast.success(nowWishlisted ? "Added to wishlist" : "Removed from wishlist")
  }

  if (loading) return <PDPSkeleton />

  if (error || !product) {
    return <div className="p-20 text-center">Product not found</div>
  }

  const images = [
    product.thumbnail,
    ...product.images.map(i => i.url)
  ].filter(Boolean)

  const discountedPrice =
    product.discountPercentage
      ? product.price * (1 - product.discountPercentage / 100)
      : null

  const avgRating =
    product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : product.rating ?? 0

  return (
    
    <div className="min-h-screen bg-[#faf7f3]">

      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 pt-6">
  <button
    onClick={() => router.back()}
    className="flex items-center gap-2 text-sm text-[#8a7f78] hover:text-[#0a0a0f] transition-colors"
  >
    <ArrowLeft size={15} />
    Back
  </button>
</div>

      <div className="max-w-[1200px] mx-auto px-6 py-10 space-y-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          <PDPImageGallery
            images={images}
            title={product.title}
            discountPercentage={product.discountPercentage}
          />

          {/* Product Info */}
          <div className="space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-xs text-[#8a7f78]">
              <Link href="/explore">{product.category.name}</Link>
              <ChevronRight size={12} />
              <span>{product.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-[clamp(28px,4vw,42px)] font-light leading-tight text-[#0a0a0f]">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRow rating={avgRating} />
              <span className="text-sm">{avgRating.toFixed(1)}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-[#8a7f78]">
                {product.reviews.length} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-light">
                ${discountedPrice
                  ? discountedPrice.toFixed(2)
                  : product.price.toFixed(2)}
              </span>
              {discountedPrice && (
                <span className="line-through text-[#8a7f78]">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Separator />

            {/* Description */}
            <p className="text-[14px] font-light text-[#0a0a0f]/65 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 h-12 rounded-xl bg-[#0a0a0f] text-white
                  hover:bg-[#c8622a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c8622a]/30
                  transition-all duration-200 gap-2 disabled:opacity-60"
              >
                <ShoppingBag size={15} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={`h-12 w-12 rounded-xl flex-shrink-0 p-0 transition-all duration-200 ${
                  isWishlisted
                    ? "border-[#c8622a]/40 bg-[#c8622a]/5"
                    : "border-[#e8e3dd] hover:border-[#c8622a]/40"
                }`}
              >
                <Heart
                  size={16}
                  className={isWishlisted
                    ? "fill-[#c8622a] stroke-[#c8622a]"
                    : "stroke-[#8a7f78]"
                  }
                />
              </Button>
            </div>

            {/* InfoPills */}
            <div className="grid grid-cols-2 gap-2.5">
              <InfoPill
                icon={<Truck size={14} />}
                label="Shipping"
                value={product.shippingInformation}
              />
              <InfoPill
                icon={<Shield size={14} />}
                label="Warranty"
                value={product.warrantyInformation}
              />
              <InfoPill
                icon={<RotateCcw size={14} />}
                label="Returns"
                value={product.returnPolicy}
              />
              <InfoPill
                icon={<Package size={14} />}
                label="SKU"
                value={product.sku}
              />
            </div>

          </div>

        </div>

        {/* Reviews Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-light">Customer Reviews</h2>
          <Separator />
          {product.reviews.length === 0 ? (
            <p className="text-[#8a7f78]">No reviews yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}