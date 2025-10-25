import {Router} from "express"
import { ServiceCreationController, UploadServiceLogoController } from "./controller.js"
import { Uploader } from "../../fileHandling/multer.js"

export const router = Router()

router.post("/service", async(req, res)=>await ServiceCreationController.controller(req, res, null))
router.post(
    "/service/upload-logo",Uploader({maxSizeMB: 5, fieldName: "serviceLogo"}), 
    async(req, res)=>await UploadServiceLogoController.controller(req, res, null)
)

