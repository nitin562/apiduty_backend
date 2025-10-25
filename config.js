import { loadEnv } from "./utils/loadenv.js";

loadEnv()

export class ServerConfig{
    static env = process.env.environ || "dev"
    static PORT = process.env.PORT
    static isProd = this.env=="prod"
    static jwtSecret1 = process.env.jwt_access_secret
    static jwtSecret2 = process.env.jwt_refresh_secret
    static jwtExpiry1 = process.env.jwt_access_expiry
    static jwtExpiry2 = process.env.jwt_refresh_expiry
}

export class DbConfig extends ServerConfig{
    static username = process.env.db_username
    static password = process.env.db_password
    static host = process.env.db_host
    static dbName = process.env.db_name

    static get dbUrl(){
        if(this.isProd){
            return `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.dbName}?retryWrites=true&w=majority`;
        }
        return `mongodb://localhost:27017/${this.dbName}`
    }
}

export class CloudinaryConfig extends ServerConfig{
    static cloudinaryKey = process.env.cloudinary_key
    static cloudinarySecret = process.env.cloudinary_secret
    static cloudinaryName = process.env.cloudinary_name
}

export class TemporalConfig extends ServerConfig{
    static taskQueue = process.env.task_queue
}