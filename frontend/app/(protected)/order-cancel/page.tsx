"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar/Navbar"
import { useState } from "react"

function OrderCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar search={search} setSearch={setSearch} />
      <div className="max-w-[500px] mx-auto px-4 py-24 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
          <XCircle size={36} className="text-red-400" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8622a] mb-1">
            Payment Cancelled
          </p>
          <h1 className="text-[clamp(28px,4vw,44px)] font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order <em>Cancelled</em>
          </h1>
          <p className="text-sm text-[#8a7f78] mt-2">
            Your payment was cancelled. Your cart is still saved.
          </p>
          {orderId && (
            <p className="text-xs text-[#8a7f78] mt-1">Order #{orderId} was not charged.</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => router.push("/checkout")}
            className="h-11 px-6 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm hover:bg-[#c8622a] transition-all gap-2"
          >
            <ArrowLeft size={15} />
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/explore")}
            variant="outline"
            className="h-11 px-6 rounded-xl border-[#e8e3dd] text-[#8a7f78] text-sm hover:text-[#0a0a0f] gap-2"
          >
            <ShoppingCart size={15} />
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderCancelPage() {
  return (
    <Suspense>
      <OrderCancelContent />
    </Suspense>
  )
}