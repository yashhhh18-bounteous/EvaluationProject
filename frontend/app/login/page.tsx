"use client"
import { useLogin } from "../features/auth/auth.mutations"
import { useState } from "react"
import { Lock, Mail, ArrowRight, ShoppingBag, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Add to your globals.css or layout.tsx:
// import { Cormorant_Garamond, DM_Sans, Bebas_Neue } from "next/font/google"
// Apply font variables to <html> or root layout

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  
  const router = useRouter()
  const loginMutation = useLogin()

const handleLogin = async () => {

  loginMutation.mutate(
    { email, password },
    {
      onSuccess: () => {
        toast.success("Login successful")
        window.location.href = "/explore"
      },
      onError: () => {
        toast.error("Invalid email or password")
      }
    }
  )

}
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] font-sans">

      {/* ── LEFT PANEL ── */}
      <div className="relative hidden lg:flex w-[55%] flex-col justify-between p-14 overflow-hidden">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_65%,rgba(200,98,42,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_80%_15%,rgba(200,98,42,0.07)_0%,transparent_60%)]" />

        {/* Giant decorative letter */}
        <div
          className="pointer-events-none select-none absolute -bottom-8 -left-4 text-[260px] leading-none font-black text-[#c8622a]/[0.04]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          aria-hidden
        >
          Y
        </div>

        {/* Top: Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c8622a]/60 text-[#c8622a]">
            <ShoppingBag size={17} />
          </div>
          <span
            className="text-2xl tracking-[0.14em] text-[#f5f0eb]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Yash<span className="text-[#c8622a]">Cart</span>
          </span>
        </div>

        {/* Middle: Hero */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c8622a]">
            <div className="h-px w-8 bg-[#c8622a]" />
            Premium Commerce
          </div>

          <h1
            className="text-[clamp(52px,5.5vw,82px)] font-light leading-[0.95] text-[#f5f0eb]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Shop<br />
            with<br />
            <em className="font-normal text-[#e8845a] not-italic" style={{ fontStyle: "italic" }}>
              intention.
            </em>
          </h1>

          <p className="max-w-[340px] text-sm font-light leading-relaxed text-[#8a7f78]">
            A curated platform where speed meets elegance. Every detail crafted for the modern shopper.
          </p>
        </div>

        {/* Bottom: Features + tag */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3.5">
            {[
              "Lightning fast product discovery",
              "Secure checkout & order tracking",
              "Personalized shopping experience",
              "Modern full-stack architecture",
            ].map((feat) => (
              <div
                key={feat}
                className="group flex items-center gap-3.5 text-[13px] font-light text-[#f5f0eb]/40 transition-colors duration-300 hover:text-[#f5f0eb]/80"
              >
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c8622a]" />
                {feat}
              </div>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.08em] text-[#8a7f78]/50 font-light">
            Intern Evaluation · Next.js + Express + PostgreSQL
          </p>
        </div>
      </div>

      {/* Vertical separator */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#8a7f78]/20 to-transparent my-16" />

      {/* ── RIGHT PANEL ── */}
      <div className="relative flex flex-1 items-center justify-center bg-[#faf7f3] px-6 py-12">

        {/* Top accent bar (mobile) */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#c8622a] via-[#e8845a] to-transparent lg:hidden" />

        <div className="w-full max-w-[390px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Mobile brand */}
          <div className="text-center lg:hidden">
            <span
              className="text-4xl tracking-[0.14em] text-[#0a0a0f]"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Yash<span className="text-[#c8622a]">Cart</span>
            </span>
          </div>

          {/* Form header */}
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#c8622a]">
              Welcome back
            </p>
            <h2
              className="text-[42px] font-light leading-tight text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Sign{" "}
              <em style={{ fontStyle: "italic" }}>in</em>
            </h2>
            <p className="text-[13px] font-light text-[#8a7f78]">
              Continue your shopping journey
            </p>
          </div>

          {/* Card */}
          <Card className="border border-[#e8e3dd] bg-white shadow-xl shadow-[#c8622a]/5 rounded-2xl">
            <CardContent className="p-6 space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78] transition-colors peer-focus:text-[#c8622a]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a] focus-visible:ring-[#c8622a]/15 focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a] focus-visible:ring-[#c8622a]/15 focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* CTA */}
          <Button
            onClick={handleLogin}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-full h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
              hover:bg-[#c8622a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c8622a]/30
              active:translate-y-0 transition-all duration-200 group"
          >
            <span className="flex items-center gap-2.5">
              Sign In
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-[#e8e3dd]" />
            <span className="text-[11px] text-[#8a7f78] font-light tracking-wide">new here?</span>
            <Separator className="flex-1 bg-[#e8e3dd]" />
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] font-light text-[#8a7f78]">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#c8622a] underline-offset-4 hover:underline transition-all"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}