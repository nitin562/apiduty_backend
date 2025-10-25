import jwt from "jsonwebtoken"

import { ServerConfig } from "../../config.js";

export class JwtToken{
    static accessTokenSecret = ServerConfig.jwtSecret1
    static accessTokenExpiry = ServerConfig.jwtExpiry1
    static refreshTokenSecret = ServerConfig.jwtSecret2
    static refreshTokenExpiry = ServerConfig.jwtExpiry2

    static generateAccessToken(data){
        const token = jwt.sign(data, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry
        })
        return token
    }

    static verifyAccessToken(token){
        return jwt.verify(token, this.accessTokenSecret)
    }

    static generateARefreshToken(data){
        const token = jwt.sign(data, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry
        })
        return token
    }

    static verifyRefreshToken(token){
        return jwt.verify(token, this.refreshTokenSecret)
    } 
}
