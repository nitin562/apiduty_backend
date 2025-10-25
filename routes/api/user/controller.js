import { BaseController } from "../../baseController.js";
import { PasswordByBcrypt } from "../../security/password.js";
import { JwtToken } from "../../security/token.js";
import { EmailNotFoundMessage, SessionTimeOutMessage, UserAlreadyExist, WrongPasswordMessage } from "./message.js";
import { User } from "./models.js";
import { loginParser, RefreshTokenParser, RegisterParser } from "./parser.js";
import { loginSerializer, pingSerializer, RefreshTokenSerializer, RegisterSerializer } from "./serializer.js";


export class PingController extends BaseController{
    jwt = true
    serializer = pingSerializer
    method = "GET"

    async handleRequest(){
        const {email, username} = this.req.user
        const response = {
            login: true, email, username
        }
        this.sendResponse(200, response, {message: "Success"})
    }
}

export class LoginController extends BaseController{
    jwt = false
    parser = loginParser
    serializer = loginSerializer
    method = "POST"

    generateTokens(clientId){
        const payload = {
            "userId": clientId
        }
        
        const accessToken = JwtToken.generateAccessToken(payload)
        const refreshToken = JwtToken.generateARefreshToken(payload)
        return {accessToken, refreshToken}
    }

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {email, password} = data
        const user = await User.findOne({email})
        if(!user){
            this.sendResponse(400, null, {messageClass: EmailNotFoundMessage})
            return
        }

        const isPasswordMatched = await PasswordByBcrypt.matchify(password, user.password)
        if(!isPasswordMatched){
            this.sendResponse(400, null, {messageClass: WrongPasswordMessage})
            return
        }


        // generate new refresh token and access token
        const {accessToken, refreshToken} = this.generateTokens(user.clientId)
        user.refreshToken = refreshToken
        await user.save()

        this.res.set("access-token", accessToken)
        this.res.set("refresh-token", refreshToken)
        
        user.login = true
        this.sendResponse(200, user, {message: "Success"})
        return
    }
}


export class RegisterController extends BaseController{
    jwt = false
    parser = RegisterParser
    serializer = RegisterSerializer
    method = "POST"

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {username, email, password} = data
        let user = await User.findOne({email})
        if(user){
            this.sendResponse(400, null, {messageClass: UserAlreadyExist})
            return
        }

        const hashedPassword = await PasswordByBcrypt.hashify(password)

        user = User()
        user.username = username
        user.password = hashedPassword
        user.email = email
        await user.save()
    
        user.registered = true
        this.sendResponse(200, user, {message: "Success"})
        return
    }
}


export class RefreshTokenController extends BaseController{
    method = "POST"
    serializer = RefreshTokenSerializer
    parser = RefreshTokenParser
    jwt = false

    generateTokens(clientId){
        const payload = {
            "userId": clientId
        }
        
        const accessToken = JwtToken.generateAccessToken(payload)
        const refreshToken = JwtToken.generateARefreshToken(payload)
        return {accessToken, refreshToken}
    }

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {refreshToken:token} = data
        let user = null
        try{
            const payload = JwtToken.verifyRefreshToken(token)
            user = User.findOne({clientId: payload.userId})
            if(!user){
                throw new Error()
            }
        }catch(err){
            this.sendResponse(401, null, {messageClass: SessionTimeOutMessage})
            return
        }

        //generate tokens
        const {accessToken, refreshToken} = this.generateTokens(user.clientId)
        user.refreshToken = refreshToken
        await user.save()

        this.res.set("access-token", accessToken)
        this.res.set("refresh-token", refreshToken)
        
        user.refreshed = true
        this.sendResponse(200, user, {message: "Session Extended"})
        return
    }
}
