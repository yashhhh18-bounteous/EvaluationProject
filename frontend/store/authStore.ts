// store/authStore.ts
import { create } from "zustand"
import { api } from "@/lib/api"

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

interface User {
  id: number
  email: string
  name: string
  phone?: string        // ← ADD
  addresses: Address[]  // ← ADD
}

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  loadUser: async () => {
    try {
      const res = await api.get("/auth/me")
      set({ user: res.data, loading: false, initialized: true })
    } catch {
      set({ user: null, loading: false, initialized: true })
    }
  }
}))