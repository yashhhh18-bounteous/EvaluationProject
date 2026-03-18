"use client"
 
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, Heart, ShoppingCart, Package, UserCircle, ChevronDown, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { api } from "@/lib/api"
import { useState, useRef, useEffect } from "react"
 
function getInitials(name?: string, email?: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return "?"
}
 
interface NavbarProps {
  search?: string
  setSearch?: (v: string) => void
}
 
export default function Navbar({ search, setSearch }: NavbarProps) {
  const cartCount = useCartStore((s) => s.cartCount)
  const wishlistCount = useWishlistStore((s) => s.wishlistCount)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
 
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
 
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])
 
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {}
    useAuthStore.setState({ user: null, initialized: true })
    useCartStore.setState({ items: [], cartCount: 0 })
    useWishlistStore.setState({ items: [], wishlistCount: 0 })
    router.push("/login")
  }
 
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#8a7f78]/10">
      <div className="flex items-center gap-4 px-6 py-3.5 max-w-[1600px] mx-auto">
 
        {/* Brand */}
        <Link href="/explore" className="flex items-center gap-2.5 flex-shrink-0">
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
 
        {/* Search (only when props provided) */}
        {search !== undefined && setSearch && (
          <div className="relative flex-1 max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
            <Input
              placeholder="Search products, brands…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-[#1a1a22] border-[#8a7f78]/20 text-[#f5f0eb] text-sm font-light placeholder:text-[#8a7f78]/50 focus-visible:border-[#059669]/60 focus-visible:ring-[#059669]/10 focus-visible:ring-2"
            />
          </div>
        )}
 
        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
 
          {/* Explore — always visible */}
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-light transition-colors text-[#059669] bg-[#059669]/10"
          >
            Explore
          </Link>
 
          {/* Protected links — only if logged in */}
          {user && (
            <>
              <Link
                href="/orders"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-light transition-colors text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5"
              >
                <Package size={15} />
                Orders
              </Link>
 
              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-light transition-colors text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5"
              >
                <Heart size={15} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-1 text-[10px] bg-[#059669] text-white px-1.5 py-[1px] rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
 
              <Link
                href="/cart"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-light transition-colors text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5"
              >
                <ShoppingCart size={15} />
                Cart
                {cartCount > 0 && (
                  <span className="ml-1 text-[10px] bg-[#059669] text-white px-1.5 py-[1px] rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
 
          {/* Profile dropdown — only if logged in */}
          {user ? (
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#f5f0eb]/5 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#059669]/20 border border-[#059669]/30 flex items-center justify-center text-[#059669] text-xs font-medium">
                  {getInitials(user?.name, user?.email)}
                </div>
                <ChevronDown size={13} className={`text-[#8a7f78] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
 
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0a0a0f] border border-[#8a7f78]/15 shadow-xl overflow-hidden z-50">
 
                  <div className="px-4 py-3 border-b border-[#8a7f78]/10">
                    <p className="text-sm font-medium text-[#f5f0eb] truncate">
                      {user?.name ?? "User"}
                    </p>
                    <p className="text-xs text-[#8a7f78] truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
 
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { setOpen(false); router.push("/profile") }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5 transition-colors"
                    >
                      <UserCircle size={15} />
                      Edit Profile
                    </button>
 
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
 
          ) : (
            // Not logged in — show Sign In + Sign Up
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-light text-[#8a7f78] hover:text-[#f5f0eb] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-light bg-[#059669] text-white hover:bg-[#059669]/80 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
 
        </div>
      </div>
    </nav>
  )
}
 