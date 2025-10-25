import { Schema } from "mongoose";
import crypto from "crypto"

import { createModel } from "../../baseModel.js";

const schema = new Schema(
  {
    userId: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceDescription: {
        type: String,
        required: true
    },
    serviceLogo: {
        type: String,
    },
    serviceStatus: {
        type: String,
        enum: ["CRITICAL", "HIGH", "MEDIUM", "NORMAL", "LOW"],
        required: true
    },
    serviceState: {
        type: String,
        enum: ["ON", "OFF"],
        required: true
    },
    serviceToken: {
        type: String,
        required: true
    },
    serviceKey:{
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

schema.methods.generateCredentials = () =>{
    const token = crypto.randomBytes(8).toString("hex");
    const key = crypto.randomBytes(32).toString("hex");
    return {token, key}
}

export const Service = createModel("Service", schema);
