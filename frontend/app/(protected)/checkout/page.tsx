"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useCreateCheckoutSession } from "../../features/orders/orders.mutation"

import Navbar from "@/components/navbar/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { api } from "@/lib/api"
import {
  MapPin, Plus, Star, ArrowLeft,
  ShoppingBag, ArrowRight, Truck, CheckCircle2
} from "lucide-react"

interface Address {
  id: number
  label?: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

interface AddressForm {
  label: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

const emptyAddress: AddressForm = {
  label: "", line1: "", line2: "",
  city: "", state: "", pincode: "",
  country: "India", isDefault: false,
}

export default function CheckoutPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loadUser = useAuthStore((s) => s.loadUser)
  const items = useCartStore((s) => s.items)
  const fetchCart = useCartStore((s) => s.fetchCart)

  const [search, setSearch] = useState("")
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses ?? [])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    user?.addresses?.find((a) => a.isDefault)?.id ?? user?.addresses?.[0]?.id ?? null
  )

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress)
  const [savingAddress, setSavingAddress] = useState(false)

 const checkoutMutation = useCreateCheckoutSession()

  // totals
  const subtotal = items.reduce((sum, item) => {
    if (!item.product) return sum
    const price = item.product.discountPercentage
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal > 500 ? 0 : 20
  const total = subtotal + shipping

  const handleAddAddress = async () => {
    if (!addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill all required fields")
      return
    }
    setSavingAddress(true)
    try {
      await api.post("/auth/addresses", addressForm)
      const updated = await api.get("/auth/addresses")
      setAddresses(updated.data)
      await loadUser()
      const newest = updated.data[updated.data.length - 1]
      setSelectedAddressId(newest?.id ?? null)
      setAddressForm(emptyAddress)
      setShowAddressForm(false)
      toast.success("Address added")
    } catch {
      toast.error("Failed to add address")
    } finally {
      setSavingAddress(false)
    }
  }

  const handlePlaceOrder = async () => {
  if (!selectedAddressId) {
    toast.error("Please select a delivery address")
    return
  }
  if (items.length === 0) {
    toast.error("Your cart is empty")
    return
  }

  checkoutMutation.mutate(selectedAddressId, {
    onSuccess: (data) => {
      // redirect to Stripe hosted checkout
      window.location.href = data.url
    },
    onError: () => {
      toast.error("Failed to initiate payment")
    }
  })
}

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Navbar search={search} setSearch={setSearch} />
        <div className="flex flex-col items-center justify-center py-32 space-y-5">
          <div className="h-20 w-20 rounded-2xl bg-white border border-[#e8e3dd] flex items-center justify-center text-[#8a7f78]">
            <ShoppingBag size={32} />
          </div>
          <p className="text-2xl font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your cart is <em>empty</em>
          </p>
          <Button
            onClick={() => router.push("/explore")}
            className="h-11 px-8 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm hover:bg-[#c8622a] transition-all"
          >
            Start Exploring
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar search={search} setSearch={setSearch} />

      <div className="max-w-[1100px] mx-auto px-4 py-10 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#8a7f78] hover:text-[#0a0a0f] transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Cart
        </button>

        {/* Header */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8622a] mb-1">
            Almost there
          </p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-light text-[#0a0a0f]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Left — Address */}
          <div className="space-y-4">

            <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-[#0a0a0f] tracking-wide uppercase">
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-[#c8622a] hover:text-[#c8622a]/80 transition-colors"
                >
                  <Plus size={13} />
                  Add New
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="border border-[#e8e3dd] rounded-xl p-4 space-y-3 bg-[#faf7f3]">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-[#8a7f78]">Label (optional)</label>
                      <Input placeholder="Home, Work…"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                        className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#8a7f78]">Country</label>
                      <Input placeholder="India"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))}
                        className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#8a7f78]">Line 1 *</label>
                    <Input placeholder="Street address"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
                      className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#8a7f78]">Line 2</label>
                    <Input placeholder="Apt, floor, landmark…"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))}
                      className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-[#8a7f78]">City *</label>
                      <Input placeholder="Mumbai"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                        className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#8a7f78]">State *</label>
                      <Input placeholder="Maharashtra"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                        className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#8a7f78]">Pincode *</label>
                      <Input placeholder="400001"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm((f) => ({ ...f, pincode: e.target.value }))}
                        className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))}
                      className="accent-[#c8622a]" />
                    <label htmlFor="isDefault" className="text-xs text-[#8a7f78]">
                      Set as default address
                    </label>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleAddAddress} disabled={savingAddress}
                      className="flex-1 h-10 bg-[#0a0a0f] hover:bg-[#0a0a0f]/90 text-[#f5f0eb] rounded-xl text-sm font-light">
                      {savingAddress ? "Saving..." : "Save Address"}
                    </Button>
                    <Button onClick={() => { setShowAddressForm(false); setAddressForm(emptyAddress) }}
                      variant="outline"
                      className="h-10 px-4 rounded-xl border-[#e8e3dd] text-sm text-[#8a7f78]">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Address List */}
              {addresses.length === 0 && !showAddressForm && (
                <div className="text-center py-8 text-sm text-[#8a7f78]">
                  No saved addresses — add one above
                </div>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`relative rounded-xl border p-4 text-sm cursor-pointer transition-all duration-200 ${
                      selectedAddressId === addr.id
                        ? "border-[#c8622a] bg-[#c8622a]/5 shadow-sm shadow-[#c8622a]/10"
                        : "border-[#e8e3dd] bg-[#faf7f3] hover:border-[#c8622a]/30"
                    }`}
                  >
                    {/* Selected indicator */}
                    <div className={`absolute top-4 right-4 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedAddressId === addr.id
                        ? "border-[#c8622a] bg-[#c8622a]"
                        : "border-[#e8e3dd] bg-white"
                    }`}>
                      {selectedAddressId === addr.id && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#c8622a] font-medium mb-1.5">
                        <Star size={10} fill="#c8622a" />
                        Default
                      </span>
                    )}

                    <div className="flex items-start gap-2.5 pr-8">
                      <MapPin size={14} className="text-[#c8622a] mt-0.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        {addr.label && (
                          <p className="font-medium text-[#0a0a0f]">{addr.label}</p>
                        )}
                        <p className="text-[#8a7f78]">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                        </p>
                        <p className="text-[#8a7f78]">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-[#8a7f78]">{addr.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-4">
              <h2 className="text-sm font-medium text-[#0a0a0f] tracking-wide uppercase">
                Order Items ({items.length})
              </h2>
              <div className="space-y-3">
                {items.filter((i) => i.product).map((item) => {
                  const price = item.product.discountPercentage
                    ? item.product.price * (1 - item.product.discountPercentage / 100)
                    : item.product.price
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-[#faf7f3] border border-[#e8e3dd] overflow-hidden flex-shrink-0">
                        <img src={item.product.thumbnail} alt={item.product.title}
                          className="h-full w-full object-contain p-1.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0a0a0f] truncate font-light"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {item.product.title}
                        </p>
                        <p className="text-xs text-[#8a7f78]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-light text-[#0a0a0f] flex-shrink-0">
                        ${(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-5 sticky top-24">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8622a] mb-1">
                Summary
              </p>
              <h2 className="text-2xl font-light text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Order <em>total</em>
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
                <div className="text-[11px] text-[#8a7f78] bg-[#faf7f3] rounded-lg px-3 py-2">
                  Add ${(500 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}
            </div>

            <Separator className="bg-[#e8e3dd]" />

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-[#0a0a0f]">Total</span>
              <span className="text-3xl font-light text-[#0a0a0f]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Delivery info */}
            <div className="flex items-center gap-2 text-xs text-[#8a7f78] bg-[#faf7f3] rounded-xl px-3 py-2.5">
              <Truck size={13} className="text-[#c8622a] flex-shrink-0" />
              Estimated delivery in 3–5 business days
            </div>

           <Button
  onClick={handlePlaceOrder}
  disabled={checkoutMutation.isPending || !selectedAddressId}
  className="w-full h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
    hover:bg-[#c8622a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c8622a]/30
    active:translate-y-0 transition-all duration-200 group gap-2 disabled:opacity-50"
>
  {checkoutMutation.isPending ? (
    "Redirecting to payment..."
  ) : (
    <>
      <CheckCircle2 size={15} />
      Pay Now
      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
    </>
  )}
</Button>
          </div>
        </div>
      </div>
    </div>
  )
}