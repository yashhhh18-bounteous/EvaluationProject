"use client"

import { useRouter } from "next/navigation"
import { useRegister } from "../features/auth/auth.mutations"
import { useState } from "react"
import { Lock, Mail, ArrowRight, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")


const router = useRouter()
 const registerMutation = useRegister()
 const handleSignup = async () => {

  if(password !== confirm){
    toast.error("Passwords do not match")
    return
  }

  registerMutation.mutate(
    { name, email, password },
    {
      onSuccess: () => {
        toast.success("Account created successfully")
        router.push("/login")
      },
      onError: () => {
        toast.error("Signup failed")
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
            Join the Platform
          </div>

          <h1
            className="text-[clamp(52px,5.5vw,82px)] font-light leading-[0.95] text-[#f5f0eb]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your<br />
            journey<br />
            <em className="font-normal text-[#e8845a]" style={{ fontStyle: "italic" }}>
              starts here.
            </em>
          </h1>

          <p className="max-w-[340px] text-sm font-light leading-relaxed text-[#8a7f78]">
            Create your account in seconds and step into a shopping experience built around you.
          </p>
        </div>

        {/* Bottom: Steps + tag */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3.5">
            {[
              { step: "01", label: "Create your free account" },
              { step: "02", label: "Browse thousands of products" },
              { step: "03", label: "Checkout securely, anytime" },
              { step: "04", label: "Track every order in real-time" },
            ].map(({ step, label }) => (
              <div
                key={step}
                className="group flex items-center gap-4 text-[13px] font-light text-[#f5f0eb]/40 transition-colors duration-300 hover:text-[#f5f0eb]/80"
              >
                <span
                  className="text-[11px] font-medium tracking-widest text-[#c8622a]/60 group-hover:text-[#c8622a] transition-colors"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {step}
                </span>
                <div className="h-px w-4 bg-[#c8622a]/20 group-hover:bg-[#c8622a]/50 transition-colors" />
                {label}
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
              Get started
            </p>
            <h2
              className="text-[42px] font-light leading-tight text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Create{" "}
              <em style={{ fontStyle: "italic" }}>account</em>
            </h2>
            <p className="text-[13px] font-light text-[#8a7f78]">
              It's free and takes under a minute
            </p>
          </div>

          {/* Card */}
          <Card className="border border-[#e8e3dd] bg-white shadow-xl shadow-[#c8622a]/5 rounded-2xl">
            <CardContent className="p-6 space-y-5">

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                  <Input
                    type="text"
                    placeholder="Yash Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a] focus-visible:ring-[#c8622a]/15 focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a] focus-visible:ring-[#c8622a]/15 focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>

              {/* Thin divider */}
              <div className="h-px bg-[#f0ebe4]" />

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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a7f78]" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-[#e8e3dd] bg-[#faf7f3] text-sm font-light text-[#0a0a0f] placeholder:text-[#8a7f78]/50 focus-visible:border-[#c8622a] focus-visible:ring-[#c8622a]/15 focus-visible:ring-2 transition-all"
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Terms note */}
          <p className="text-[12px] font-light text-[#8a7f78] text-center leading-relaxed px-2">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-[#c8622a] hover:underline underline-offset-4 transition-all">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#c8622a] hover:underline underline-offset-4 transition-all">
              Privacy Policy
            </Link>
          </p>

          {/* CTA */}
          <Button
            onClick={handleSignup}
            className="w-full h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
              hover:bg-[#c8622a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c8622a]/30
              active:translate-y-0 transition-all duration-200 group"
          >
            <span className="flex items-center gap-2.5">
              Create Account
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-[#e8e3dd]" />
            <span className="text-[11px] text-[#8a7f78] font-light tracking-wide">have an account?</span>
            <Separator className="flex-1 bg-[#e8e3dd]" />
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] font-light text-[#8a7f78]">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-medium text-[#c8622a] underline-offset-4 hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}