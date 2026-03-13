"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useVerifySession } from "../../features/orders/orders.mutation"
import { useCartStore } from "@/store/cartStore"
import { useEffect, useState } from "react"
import { CheckCircle2, Package, MapPin, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar/Navbar"

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id") ?? ""
  const fetchCart = useCartStore((s) => s.fetchCart)
  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useVerifySession(sessionId)

  useEffect(() => {
    if (data?.order) {
      fetchCart()
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf7f3] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#059669]" />
          <p className="text-sm text-[#8a7f78]">Confirming your order...</p>
        </div>
      </div>
    )
  }

  if (isError || !data?.order) {
    return (
      <div className="min-h-screen bg-[#faf7f3] flex items-center justify-center"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="text-center space-y-4">
          <p className="text-lg text-[#0a0a0f]">Something went wrong verifying your order.</p>
          <Button onClick={() => router.push("/orders")}
            className="h-11 px-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm hover:bg-[#059669] transition-all">
            View Orders
          </Button>
        </div>
      </div>
    )
  }

  const { order } = data

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar search={search} setSearch={setSearch} />

      <div className="max-w-[600px] mx-auto px-4 py-16 space-y-6">

        {/* Success header */}
        <div className="text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
              Payment Successful
            </p>
            <h1 className="text-[clamp(28px,4vw,44px)] font-light text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Order <em>Confirmed</em>
            </h1>
            <p className="text-sm text-[#8a7f78] mt-2">
              Order #{order.id} has been placed successfully
            </p>
          </div>
        </div>

        {/* Order summary card */}
        <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-5">

          {/* Address */}
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="text-[#059669] mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-[#0a0a0f] uppercase tracking-wide">
                Delivering to
              </p>
              <p className="text-sm text-[#8a7f78]">
                {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}
              </p>
              <p className="text-sm text-[#8a7f78]">
                {order.addressCity}, {order.addressState} — {order.addressPincode}
              </p>
            </div>
          </div>

          <Separator className="bg-[#e8e3dd]" />

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#faf7f3] border border-[#e8e3dd] overflow-hidden flex-shrink-0">
                  <img src={item.thumbnail} alt={item.title}
                    className="h-full w-full object-contain p-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0a0a0f] truncate font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </p>
                  <p className="text-xs text-[#8a7f78]">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-light text-[#0a0a0f]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="bg-[#e8e3dd]" />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#8a7f78]">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#8a7f78]">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#0a0a0f] pt-1">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/orders")}
            className="flex-1 h-11 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm hover:bg-[#059669] transition-all gap-2 group"
          >
            <Package size={15} />
            View Orders
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={() => router.push("/explore")}
            variant="outline"
            className="flex-1 h-11 rounded-xl border-[#e8e3dd] text-[#8a7f78] text-sm hover:text-[#0a0a0f]"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  )
}