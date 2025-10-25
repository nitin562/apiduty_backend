import { deleteImage } from "../../routes/fileHandling/cloudinary.js"

export async function imageCleanActivity(path){
    if(!path){
        return
    }

    let publicId = null

    try{
        publicId = path.split("/").at(-1)
        publicId = publicId.split(".")[0]
    }catch(err){
        console.log(`[CLOUDINARY WORKER ERROR] - ${err.message}`)
        return
    }

    return await deleteImage(publicId)
}
