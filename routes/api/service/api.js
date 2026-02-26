import {Router} from "express"
import { ListServicesController, ServiceCreationController, UploadServiceLogoController } from "./controller.js"
import { Uploader } from "../../fileHandling/multer.js"

export const router = Router()

router.post("/service", async(req, res, next)=>await ServiceCreationController.controller(req, res, next))
router.post(
    "/service/upload-logo",Uploader({maxSizeMB: 5, fieldName: "serviceLogo"}), 
    async(req, res, next)=>await UploadServiceLogoController.controller(req, res, next)
)
router.get("/", async(req, res, next)=>await ListServicesController.controller(req, res, next))
