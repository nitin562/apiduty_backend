import express from "express"

import { ServerConfig } from "./config.js"
import { initDbConnection } from "./connections/dbConnection.js"
import { router } from "./routes/routes.js"

const server = express()

server.use("/api/v1",router)

initDbConnection()

const PORT = ServerConfig.PORT

server.listen(PORT, ()=>{
    console.log(
        `Server is listening at http://localhost:${PORT}`
    )
})
