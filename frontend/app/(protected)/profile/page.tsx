"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { api } from "@/lib/api"
import Navbar from "@/components/navbar/Navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { User, Phone, Mail, MapPin, Plus, Trash2, Star, ArrowLeft } from "lucide-react"

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
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
}

function getInitials(name?: string, email?: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return "?"
}

export default function ProfilePage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loadUser = useAuthStore((s) => s.loadUser)

  const [search, setSearch] = useState("")

  // profile form
  const [name, setName] = useState(user?.name ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [savingProfile, setSavingProfile] = useState(false)

  // address
  const [addresses, setAddresses] = useState<Address[]>(user?.addresses ?? [])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress)
  const [savingAddress, setSavingAddress] = useState(false)

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      await api.patch("/auth/profile", { name, phone })
      await loadUser()
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddAddress = async () => {
    if (!addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill all required fields")
      return
    }

    setSavingAddress(true)
    try {
      const res = await api.post("/auth/addresses", addressForm)
      const updated = await api.get("/auth/addresses")
      setAddresses(updated.data)
      await loadUser()
      setAddressForm(emptyAddress)
      setShowAddressForm(false)
      toast.success("Address added")
    } catch {
      toast.error("Failed to add address")
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.delete(`/auth/addresses/${id}`)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      await loadUser()
      toast.success("Address removed")
    } catch {
      toast.error("Failed to delete address")
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f3]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar search={search} setSearch={setSearch} />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#8a7f78] hover:text-[#0a0a0f] transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Avatar + name header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#c8622a]/15 border-2 border-[#c8622a]/30 flex items-center justify-center text-[#c8622a] text-xl font-medium">
            {getInitials(user?.name, user?.email)}
          </div>
          <div>
            <h1
              className="text-2xl text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {user?.name ?? "Your Profile"}
            </h1>
            <p className="text-sm text-[#8a7f78]">{user?.email}</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-5">
          <h2 className="text-sm font-medium text-[#0a0a0f] tracking-wide uppercase">
            Personal Info
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8a7f78] tracking-wide uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-[#0a0a0f] text-sm focus-visible:border-[#c8622a]/60 focus-visible:ring-[#c8622a]/10"
                />
              </div>
            </div>

            {/* Email — readonly */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8a7f78] tracking-wide uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                <Input
                  value={user?.email ?? ""}
                  disabled
                  className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#f0ece6] text-[#8a7f78] text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8a7f78] tracking-wide uppercase">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-[#0a0a0f] text-sm focus-visible:border-[#c8622a]/60 focus-visible:ring-[#c8622a]/10"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full h-11 bg-[#0a0a0f] hover:bg-[#0a0a0f]/90 text-[#f5f0eb] rounded-xl text-sm font-light tracking-wide"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Addresses Card */}
        <div className="bg-white rounded-2xl border border-[#e8e3dd] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#0a0a0f] tracking-wide uppercase">
              Saved Addresses
            </h2>
            <button
              onClick={() => setShowAddressForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-[#c8622a] hover:text-[#c8622a]/80 transition-colors"
            >
              <Plus size={13} />
              Add New
            </button>
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="border border-[#e8e3dd] rounded-xl p-4 space-y-3 bg-[#faf7f3]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#8a7f78]">Label (optional)</label>
                  <Input
                    placeholder="Home, Work…"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                    className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#8a7f78]">Country</label>
                  <Input
                    placeholder="India"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))}
                    className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8a7f78]">Line 1 *</label>
                <Input
                  placeholder="Street address"
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
                  className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8a7f78]">Line 2</label>
                <Input
                  placeholder="Apt, floor, landmark…"
                  value={addressForm.line2}
                  onChange={(e) => setAddressForm((f) => ({ ...f, line2: e.target.value }))}
                  className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#8a7f78]">City *</label>
                  <Input
                    placeholder="Mumbai"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                    className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#8a7f78]">State *</label>
                  <Input
                    placeholder="Maharashtra"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                    className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#8a7f78]">Pincode *</label>
                  <Input
                    placeholder="400001"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm((f) => ({ ...f, pincode: e.target.value }))}
                    className="h-10 rounded-lg border-[#e8e3dd] bg-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="accent-[#c8622a]"
                />
                <label htmlFor="isDefault" className="text-xs text-[#8a7f78]">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleAddAddress}
                  disabled={savingAddress}
                  className="flex-1 h-10 bg-[#0a0a0f] hover:bg-[#0a0a0f]/90 text-[#f5f0eb] rounded-xl text-sm font-light"
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </Button>
                <Button
                  onClick={() => { setShowAddressForm(false); setAddressForm(emptyAddress) }}
                  variant="outline"
                  className="h-10 px-4 rounded-xl border-[#e8e3dd] text-sm text-[#8a7f78]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Address List */}
          {addresses.length === 0 && !showAddressForm && (
            <div className="text-center py-8 text-sm text-[#8a7f78]">
              No addresses saved yet
            </div>
          )}

          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`relative rounded-xl border p-4 text-sm ${
                  addr.isDefault
                    ? "border-[#c8622a]/40 bg-[#c8622a]/5"
                    : "border-[#e8e3dd] bg-[#faf7f3]"
                }`}
              >
                {/* Default badge */}
                {addr.isDefault && (
                  <span className="absolute top-3 right-10 flex items-center gap-1 text-[10px] text-[#c8622a] font-medium">
                    <Star size={10} fill="#c8622a" />
                    Default
                  </span>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="absolute top-3 right-3 text-[#8a7f78] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-[#c8622a] mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 pr-16">
                    {addr.label && (
                      <p className="font-medium text-[#0a0a0f]">{addr.label}</p>
                    )}
                    <p className="text-[#8a7f78]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                    <p className="text-[#8a7f78]">{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-[#8a7f78]">{addr.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}