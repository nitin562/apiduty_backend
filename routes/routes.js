import express from "express"

import { router as user } from "./api/user/api.js"
import { router as service} from "./api/service/api.js"

export const router = express.Router()
router.use(express.json())

router.use((req, res, next)=>{
    console.log(`[API]: ${req.url}`)
    next()
})

router.use("/user", user)
router.use("/services", service)

router.use((err, req, res, next) => {
    if(!err){
        next()
        return
    }

    console.error(err.stack)
    const responseJson = {
      statusCode: 500,
      data: null,
      message: "Server Error Occured",
      code: "SERVER_ERROR"
    };
    res.status(500).json(responseJson);
});