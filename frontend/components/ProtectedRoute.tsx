"use client"
import { useAuthGuard } from "../lib/useAuthGuard"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useAuthGuard()
  return <>{children}</>
}