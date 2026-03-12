"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"

export default function AuthInitializer() {

  const loadUser = useAuthStore((s) => s.loadUser)

  useEffect(() => {
    loadUser()
  }, [])

  return null
}