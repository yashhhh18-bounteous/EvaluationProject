// useAuthGuard.ts
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

export function useAuthGuard() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const initialized = useAuthStore((s) => s.initialized)  

  useEffect(() => {
    if (!initialized) return   // ← wait until loadUser has actually run

    if (!user) {
      router.replace("/login")
    }
  }, [user, loading, initialized, router])
}