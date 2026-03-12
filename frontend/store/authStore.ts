// authStore.ts
import { create } from "zustand"
import { api } from "@/lib/api"

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean   // ← add this
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,    // ← starts false

  loadUser: async () => {
    try {
      const res = await api.get("/auth/me")
      set({ user: res.data, loading: false, initialized: true })
    } catch {
      set({ user: null, loading: false, initialized: true })
    }
  }
}))