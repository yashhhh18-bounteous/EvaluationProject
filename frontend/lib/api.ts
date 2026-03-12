// api.ts
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

// ← this is the key — shared refresh promise
let refreshPromise: Promise<any> | null = null

// api.ts
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    // don't retry these endpoints — just reject silently
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/me")  // ← ADD THIS
    ) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          ).finally(() => {
            refreshPromise = null
          })
        }

        await refreshPromise
        return api(originalRequest)

      } catch (err) {
        refreshPromise = null
        window.location.href = "/login"
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)
export default api