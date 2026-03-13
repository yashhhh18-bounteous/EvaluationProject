import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes"
import productRoutes from "./routes/productRoutes"
import carouselRoutes from "./routes/carouselRoutes"

import cartRoutes from "./routes/cartRoutes"
import wishlistRoutes from "./routes/wishlistRoutes"



const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: ["http://localhost:3000","https://evaluation-project-seven.vercel.app"],
    
    credentials: true
  })
)



app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/carousel", carouselRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)






app.get("/", (req, res) => {
  res.json({ message: "API running" })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})