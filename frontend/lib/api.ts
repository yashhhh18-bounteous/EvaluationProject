import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true

      try {

        await api.post("/auth/refresh")

        return api(originalRequest)

      } catch (refreshError) {

        window.location.href = "/login"

      }

    }

    return Promise.reject(error)
  }
)