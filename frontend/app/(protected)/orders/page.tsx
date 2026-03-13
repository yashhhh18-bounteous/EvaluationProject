"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOrders } from "../../features/orders/orders.mutation"
import Navbar from "@/components/navbar/Navbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Package, ArrowRight, MapPin, Clock,
  CheckCircle2, Truck, ShoppingBag, XCircle
} from "lucide-react"

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock size={13} className="text-amber-600" />
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: <CheckCircle2 size={13} className="text-blue-600" />
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: <Truck size={13} className="text-purple-600" />
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={13} className="text-emerald-600" />
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle size={13} className="text-red-500" />
  },
}

function OrderCard({ order }: { order: any }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const status = statusConfig[order.status as keyof typeof statusConfig]

  return (
    <div className="bg-white rounded-2xl border border-[#e8e3dd] overflow-hidden hover:border-[#059669]/20 hover:shadow-md hover:shadow-[#059669]/5 transition-all duration-300">

      {/* Order Header */}
      <div className="p-5 flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center text-[#059669] flex-shrink-0">
          <Package size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-[#0a0a0f]">
              Order #{order.id}
            </p>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
          </div>

          <p className="text-xs text-[#8a7f78] mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </p>

          {/* Address snapshot */}
          <div className="flex items-start gap-1.5 mt-2">
            <MapPin size={12} className="text-[#059669] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#8a7f78] line-clamp-1">
              {order.addressLine1}, {order.addressCity}, {order.addressState} — {order.addressPincode}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            ${order.total.toFixed(2)}
          </p>
          <p className="text-[11px] text-[#8a7f78] mt-0.5">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Separator className="bg-[#e8e3dd]" />

      {/* Item thumbnails preview */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {order.items.slice(0, 4).map((item: any, i: number) => (
              <div
                key={i}
                className="h-9 w-9 rounded-lg bg-[#faf7f3] border-2 border-white overflow-hidden flex-shrink-0"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-contain p-1"
                />
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="h-9 w-9 rounded-lg bg-[#faf7f3] border-2 border-white flex items-center justify-center text-[10px] text-[#8a7f78] font-medium">
                +{order.items.length - 4}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-[#059669] hover:text-[#059669]/80 transition-colors ml-2"
          >
            {expanded ? "Hide items" : "View items"}
          </button>
        </div>

        <div className="text-xs text-[#8a7f78] flex items-center gap-1">
          {order.shipping === 0 ? (
            <span className="text-emerald-600 font-medium">Free shipping</span>
          ) : (
            <span>Shipping: ${order.shipping.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Expanded items */}
      {expanded && (
        <>
          <Separator className="bg-[#e8e3dd]" />
          <div className="px-5 py-4 space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-[#faf7f3] border border-[#e8e3dd] overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0a0a0f] font-light truncate"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </p>
                  <p className="text-xs text-[#8a7f78]">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-light text-[#0a0a0f] flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            {/* Order totals breakdown */}
            <Separator className="bg-[#e8e3dd]" />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#8a7f78]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#8a7f78]">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-[#0a0a0f] pt-1">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const { data: orders, isLoading } = useOrders()

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-[800px] mx-auto px-4 py-10 space-y-6">

        {/* Header */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669] mb-1">
            Your
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Order <em style={{ fontStyle: "italic" }}>History</em>
          </h1>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#e8e3dd] h-32 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && (!orders || orders.length === 0) && (
          <div className="flex flex-col items-center justify-center py-32 space-y-5">
            <div className="h-20 w-20 rounded-2xl bg-white border border-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
              <ShoppingBag size={32} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-light text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No orders <em>yet</em>
              </p>
              <p className="text-sm font-light text-[#8a7f78]">
                Your order history will appear here
              </p>
            </div>
            <Button
              onClick={() => router.push("/explore")}
              className="h-11 px-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm hover:bg-[#059669] transition-all"
            >
              Start Shopping
            </Button>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}