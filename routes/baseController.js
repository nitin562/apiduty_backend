import fs from "fs/promises"

import { JwtToken } from "./security/token.js";
import { BadRequestMessage, InvalidTokenMessage, TokenExpiredMessage, TokenRequiredMessage, UserDeactivatedMessage } from "./message.js"
import { User } from "./api/user/models.js";

export class BaseController {
  method = null;
  parser = null;
  serializer = null;
  jwt = true;
  imgCleanup = false

  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async verifyToken() {
    let token = this.req.get("Authorization");
    if (!token) {
      this.sendResponse(401, null, { messageClass: TokenRequiredMessage });
      return false;
    }

    try {
      token = token.split("Bearer ")[1];
    } catch (err) {
      this.sendResponse(401, null, { messageClass: InvalidTokenMessage });
      return false;
    }
    
    let tokenPayload = null
    try {
      tokenPayload = JwtToken.verifyAccessToken(token);
    } catch (err) {
      let messageClass = InvalidTokenMessage;
      if (err.name === "TokenExpiredError") {
        messageClass = TokenExpiredMessage;
      }

      this.sendResponse(401, null, { messageClass });
      return false;
    }

    const user = await User.findOne({clientId: tokenPayload.userId})
    if(!user){
      this.sendResponse(401, null, { messageClass: UserDeactivatedMessage });
      return false
    }

    this.req.user = user
    return true;
  }

  parseData() {
    const { body, file, params, query } = this.req;
    const data = { ...file, ...body, ...params, ...query };

    const result = this.parser.safeParse(data);
    if (result.success) {
      return result.data;
    }

    // create error list
    const errors = result.error?.issues || [];
    const errorMapping = {};
    errors.forEach((error) => {
      const key = error.path[0];
      errorMapping[key] = error.message;
    });

    this.sendResponse(400, errorMapping, { messageClass: BadRequestMessage });
    return null;
  }

  sendResponse(status, data, options = {}) {
    const { message = "", messageClass = null } = options;

    let serializedData = data;
    if (status == 200) {
      serializedData = this.serializer ? this.serializer.parse(data) : data;
    }

    const responseJson = {
      statusCode: status,
      data: serializedData,
      message: message ? message: (status == 200 ? "Success" : "Failed"),
      code: status == 200 ? "success" : "failed",
    };

    if (messageClass) {
      responseJson["message"] = messageClass.message;
      responseJson["code"] = messageClass.code.toUpperCase();
    }

    this.res.status(status).json(responseJson);
    return;
  }

  async imageCleanUp(file){
    try{
        await fs.unlink(file.path)
    }catch(err){
        console.log("[FS ERROR] - Error in Deleting File: ", err)
    }
    }

  async handleRequest() {
    // custom implemnent
  }

  static async controller(req, res, next) {
    const instance = new this(req, res, next);
    if (!instance.jwt || await instance.verifyToken()) {
      const _ = await instance.handleRequest();
    }

    if(instance.imageCleanUp && req?.file){
      await instance.imageCleanUp(req.file)
    }
    return;
  }
}
