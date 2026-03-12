import axios from "axios"

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
})


// Attach access token
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
          "http://localhost:5000/auth/refresh",
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