import { Router } from "express"
import { getProducts,getProductById,getCategories,getFilters } from "../controllers/product.controller"

const router = Router()

router.get("/", getProducts)
router.get("/categories", getCategories)
router.get("/filters", getFilters)
router.get("/:id", getProductById)


export default router