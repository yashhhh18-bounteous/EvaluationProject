import { Router } from "express"
import { register } from "../controllers/authController"
import { login } from "../controllers/authController"
import { refresh } from "../controllers/authController"
import {logout} from"../controllers/authController"
import { authMiddleware } from "../middleware/authMiddleware"
import { me } from "../controllers/authController"




const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refresh)
router.post("/logout",logout)
router.get("/me", authMiddleware, me)


export default router