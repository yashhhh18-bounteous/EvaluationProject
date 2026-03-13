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
import { signupSchema, parseErrors, type SignupErrors } from "@/lib/validations"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<SignupErrors>({})
  const [touched, setTouched] = useState({
    name: false, email: false, password: false, confirm: false
  })

  const router = useRouter()
  const registerMutation = useRegister()

  const validate = () => parseErrors(signupSchema, { name, email, password, confirm })

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate())
  }

  const handleSignup = async () => {
    setTouched({ name: true, email: true, password: true, confirm: true })
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("Account created successfully")
          router.push("/login")
        },
        onError: () => {
          toast.error("Signup failed — email may already be in use")
        }
      }
    )
  }

  const fieldError = (field: keyof typeof touched) =>
    touched[field] ? errors[field as keyof SignupErrors] : undefined

  const inputClass = (field: keyof typeof touched) => {
    const err = fieldError(field)
    return `pl-10 h-11 rounded-xl bg-[#faf7f3] text-sm font-light text-[#0a0a0f]
      placeholder:text-[#8a7f78]/50 transition-all focus-visible:ring-2
      ${err
        ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
        : "border-[#e8e3dd] focus-visible:border-[#059669] focus-visible:ring-[#059669]/15"
      }`
  }

  const getPasswordStrength = () => {
    if (!password) return null
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "w-1/4" }
    if (score === 2) return { label: "Fair", color: "bg-amber-400", width: "w-2/4" }
    if (score === 3) return { label: "Good", color: "bg-blue-400", width: "w-3/4" }
    return { label: "Strong", color: "bg-[#059669]", width: "w-full" }
  }

  const strength = getPasswordStrength()

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] font-sans">

      {/* LEFT PANEL */}
      <div className="relative hidden lg:flex w-[55%] flex-col justify-between p-14 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_65%,rgba(5,150,105,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_80%_15%,rgba(5,150,105,0.07)_0%,transparent_60%)]" />
        <div
          className="pointer-events-none select-none absolute -bottom-8 -left-4 text-[260px] leading-none font-black text-[#059669]/[0.04]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          aria-hidden
        >Y</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#059669]/60 text-[#059669]">
            <ShoppingBag size={17} />
          </div>
          <span className="text-2xl tracking-[0.14em] text-[#f5f0eb]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Yash<span className="text-[#059669]">Cart</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#059669]">
            <div className="h-px w-8 bg-[#059669]" />
            Join the Platform
          </div>
          <h1 className="text-[clamp(52px,5.5vw,82px)] font-light leading-[0.95] text-[#f5f0eb]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your<br />journey<br />
            <em className="font-normal text-[#059669]" style={{ fontStyle: "italic" }}>starts here.</em>
          </h1>
          <p className="max-w-[340px] text-sm font-light leading-relaxed text-[#8a7f78]">
            Create your account in seconds and step into a shopping experience built around you.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-3.5">
            {[
              { step: "01", label: "Create your free account" },
              { step: "02", label: "Browse thousands of products" },
              { step: "03", label: "Checkout securely, anytime" },
              { step: "04", label: "Track every order in real-time" },
            ].map(({ step, label }) => (
              <div key={step} className="group flex items-center gap-4 text-[13px] font-light text-[#f5f0eb]/40 transition-colors duration-300 hover:text-[#f5f0eb]/80">
                <span className="text-[11px] font-medium tracking-widest text-[#059669]/60 group-hover:text-[#059669] transition-colors"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {step}
                </span>
                <div className="h-px w-4 bg-[#059669]/20 group-hover:bg-[#059669]/50 transition-colors" />
                {label}
              </div>
            ))}
          </div>
          <p className="text-[11px] tracking-[0.08em] text-[#8a7f78]/50 font-light">
            Intern Evaluation · Next.js + Express + PostgreSQL
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#8a7f78]/20 to-transparent my-16" />

      {/* RIGHT PANEL */}
      <div className="relative flex flex-1 items-center justify-center bg-[#faf7f3] px-6 py-12">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#059669] via-[#059669]/50 to-transparent lg:hidden" />

        <div className="w-full max-w-[390px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="text-center lg:hidden">
            <span className="text-4xl tracking-[0.14em] text-[#0a0a0f]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Yash<span className="text-[#059669]">Cart</span>
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#059669]">Get started</p>
            <h2 className="text-[42px] font-light leading-tight text-[#0a0a0f]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Create <em style={{ fontStyle: "italic" }}>account</em>
            </h2>
            <p className="text-[13px] font-light text-[#8a7f78]">It's free and takes under a minute</p>
          </div>

          <Card className="border border-[#e8e3dd] bg-white shadow-xl shadow-[#059669]/5 rounded-2xl">
            <CardContent className="p-6 space-y-5">

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">Full Name</Label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${fieldError("name") ? "text-red-400" : "text-[#8a7f78]"}`} />
                  <Input
                    type="text"
                    placeholder="Yash Jha"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (touched.name) setErrors(validate()) }}
                    onBlur={() => handleBlur("name")}
                    className={inputClass("name")}
                  />
                </div>
                {fieldError("name") && <p className="text-[11px] text-red-400 font-light">{fieldError("name")}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">Email Address</Label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${fieldError("email") ? "text-red-400" : "text-[#8a7f78]"}`} />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors(validate()) }}
                    onBlur={() => handleBlur("email")}
                    className={inputClass("email")}
                  />
                </div>
                {fieldError("email") && <p className="text-[11px] text-red-400 font-light">{fieldError("email")}</p>}
              </div>

              <div className="h-px bg-[#f0ebe4]" />

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${fieldError("password") ? "text-red-400" : "text-[#8a7f78]"}`} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors(validate()) }}
                    onBlur={() => handleBlur("password")}
                    className={inputClass("password")}
                  />
                </div>
                {password && strength && (
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-[#e8e3dd] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className={`text-[11px] font-light ${
                      strength.label === "Weak" ? "text-red-400" :
                      strength.label === "Fair" ? "text-amber-500" :
                      strength.label === "Good" ? "text-blue-400" :
                      "text-[#059669]"
                    }`}>{strength.label} password</p>
                  </div>
                )}
                {fieldError("password") && <p className="text-[11px] text-red-400 font-light">{fieldError("password")}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#0a0a0f]/50">Confirm Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${fieldError("confirm") ? "text-red-400" : "text-[#8a7f78]"}`} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); if (touched.confirm) setErrors(validate()) }}
                    onBlur={() => handleBlur("confirm")}
                    className={inputClass("confirm")}
                  />
                </div>
                {fieldError("confirm") && <p className="text-[11px] text-red-400 font-light">{fieldError("confirm")}</p>}
              </div>

            </CardContent>
          </Card>

          <p className="text-[12px] font-light text-[#8a7f78] text-center leading-relaxed px-2">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-[#059669] hover:underline underline-offset-4 transition-all">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-[#059669] hover:underline underline-offset-4 transition-all">Privacy Policy</Link>
          </p>

          <Button
            onClick={handleSignup}
            disabled={registerMutation.isPending}
            className="w-full h-12 rounded-xl bg-[#0a0a0f] text-[#f5f0eb] text-sm font-medium tracking-wide
              hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#059669]/30
              active:translate-y-0 transition-all duration-200 group disabled:opacity-60"
          >
            <span className="flex items-center gap-2.5">
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-[#e8e3dd]" />
            <span className="text-[11px] text-[#8a7f78] font-light tracking-wide">have an account?</span>
            <Separator className="flex-1 bg-[#e8e3dd]" />
          </div>

          <p className="text-center text-[13px] font-light text-[#8a7f78]">
            Already a member?{" "}
            <Link href="/login" className="font-medium text-[#059669] underline-offset-4 hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}