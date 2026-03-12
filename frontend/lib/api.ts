import axios from "axios"

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

/*
  Backend base URL
  Local  -> .env.local
  Prod   -> Vercel env variable
*/
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})


// Attach access token automatically
api.interceptors.request.use((config) => {

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})


// Handle refresh automatically
api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {

      console.log("Access token expired. Attempting refresh...")

      originalRequest._retry = true

      try {

        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = res.data.accessToken

        console.log("Refresh success. New access token received.")

        accessToken = newAccessToken

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (err) {

        console.error("Refresh failed", err)

        window.location.href = "/login"

      }
    }

    return Promise.reject(error)
  }
)