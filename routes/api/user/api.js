import {Router} from "express"
import { LoginController, PingController, RefreshTokenController, RegisterController } from "./controller.js"

export const router = Router()

router.get("/ping", async(req, res)=>await PingController.controller(req, res, null))
router.post("/login", async(req, res)=>await LoginController.controller(req, res, null))
router.post("/register", async(req, res)=>await RegisterController.controller(req, res, null))
router.post("/extend-session", async(req, res)=>await RefreshTokenController.controller(req, res, null))
