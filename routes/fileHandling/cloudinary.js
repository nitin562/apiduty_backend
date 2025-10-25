import {v2 as cloudinary} from "cloudinary"
import { CloudinaryConfig } from "../../config.js";

class CloudSave{
    constructor(){
        this.cloud = this.#cloudInit()
    }

    #cloudInit(){
        const cloudinaryInstance = cloudinary.config({ 
            cloud_name: CloudinaryConfig.cloudinaryName, 
            api_key: CloudinaryConfig.cloudinaryKey, 
            api_secret: CloudinaryConfig.cloudinarySecret
        });
        return cloudinaryInstance
    }

    async saveImage(path){
        let response = null
        try{
            response = await cloudinary.uploader.upload(path)
        }catch(err){
            console.log("[CLOUDINARY UPLOAD ERROR] - ", err.message)
        }
        return response
    }

    async deleteImage(publicId){
        // This is Temporal Activity Part so On Errors, it will be retry -auto
        return await cloudinary.uploader.destroy(publicId)
    }
}

export async function imgToCloud(path){
    const cloudSaver = new CloudSave()
    return await cloudSaver.saveImage(path)
}

export async function deleteImage(publicId){
    const cloudSaver = new CloudSave()
    return await cloudSaver.deleteImage(publicId)
}
