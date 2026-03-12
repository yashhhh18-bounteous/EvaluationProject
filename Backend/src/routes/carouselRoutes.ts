import { Router } from "express"
import { getCarousel } from "../controllers/carouselController"

const router = Router()

router.get("/", getCarousel)

export default router