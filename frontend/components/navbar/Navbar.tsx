"use client"

import Link from "next/link"

import { ShoppingBag, Search, Heart, ShoppingCart, Package, User } from "lucide-react"

import { Input } from "@/components/ui/input"

export default function Navbar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#8a7f78]/10">
      <div className="flex items-center gap-4 px-6 py-3.5 max-w-[1600px] mx-auto">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c8622a]/60 text-[#c8622a]">
            <ShoppingBag size={15} />
          </div>
          <span
            className="text-xl tracking-[0.14em] text-[#f5f0eb]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Yash<span className="text-[#c8622a]">Cart</span>
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
          <Input
            placeholder="Search products, brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-[#1a1a22] border-[#8a7f78]/20 text-[#f5f0eb] text-sm font-light placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a]/60 focus-visible:ring-[#c8622a]/10 focus-visible:ring-2"
          />
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 ml-auto">
          {[
            { label: "Explore", href: "/explore", active: true },
            { label: "Orders", href: "/orders", icon: <Package size={15} /> },
            { label: "Wishlist", href: "/wishlist", icon: <Heart size={15} /> },
            { label: "Cart", href: "/cart", icon: <ShoppingCart size={15} /> },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-light transition-colors ${
                item.active
                  ? "text-[#c8622a] bg-[#c8622a]/10"
                  : "text-[#8a7f78] hover:text-[#f5f0eb] hover:bg-[#f5f0eb]/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <div className="ml-2 h-8 w-8 rounded-full bg-[#c8622a]/20 border border-[#c8622a]/30 flex items-center justify-center text-[#c8622a]">
            <User size={14} />
          </div>
        </div>
      </div>
    </nav>
  )
}