"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { api } from "@/lib/api"
import Navbar from "@/components/navbar/Navbar";

import {
  ShoppingBag,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Package,
} from "lucide-react"

import PDPImageGallery from "@/components/product/PDPImageGallery"
import ReviewCard from "@/components/product/ReviewCard"
import StarRow from "@/components/product/StarRow"
import InfoPill from "@/components/product/InfoPill"
import PDPSkeleton from "@/components/product/PDPSkeleton"

import { Product } from "@/types/productPDP"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


export default function ProductDetailPage() {

  const params = useParams()
  const id = params?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {

    if (!id) return

    setLoading(true)
    setError(false)

    api
      .get(`/products/${id}`)
      .then(r => {
        setProduct(r.data.data ?? r.data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))

  }, [id])

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

      {/* Navbar */}
    <Navbar />

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

            {/* Add to Cart */}
            <Button className="h-12 rounded-xl bg-[#0a0a0f] text-white w-full
              hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#059669]/30
              transition-all duration-200">
              Add to Cart
            </Button>

            {/* ── InfoPills: shipping · warranty · returns · SKU ── */}
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

          <h2 className="text-3xl font-light">
            Customer Reviews
          </h2>

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