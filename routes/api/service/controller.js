import { TemporalConfig } from "../../../config.js"
import { getTemporalClient } from "../../../temporal/client.js"
import {BaseController} from "../../baseController.js"
import { imgToCloud } from "../../fileHandling/cloudinary.js"
import { BadRequestMessage, ServerErrorMessage } from "../../message.js"
import { Service } from "./models.js"
import { createServiceParser, serviceUpdateParser, uploadServiceLogoParser } from "./parser.js"
import { createServiceSerializer, listServicesSerializer, serviceSerializer, uploadServiceLogoSerializer } from "./serializer.js"


export class ServiceCreationController extends BaseController{
    jwt = true
    parser = createServiceParser
    serializer = createServiceSerializer
    method = "POST"

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {serviceName, serviceDescription, serviceState, serviceStatus} = data
        const {user} = this.req

        const isNameExist = await Service.findOne({serviceName, userId: user.clientId})
        if(isNameExist){
            const error = {serviceName: "Service Name is Already Exisiting"}
            this.sendResponse(400, error, {messageClass: BadRequestMessage})
            return
        }
        
        const service = new Service()
        const {token, key} = service.generateCredentials()
        service.serviceName = serviceName
        service.serviceDescription = serviceDescription
        service.serviceState = serviceState
        service.serviceStatus = serviceStatus
        service.userId = user.clientId
        service.serviceToken = token
        service.serviceKey = key
        await service.save()
        
        this.sendResponse(200, service, {"message": "Success"})
        
    }
}

export class UploadServiceLogoController extends BaseController{
    jwt = true
    parser = uploadServiceLogoParser
    serializer = uploadServiceLogoSerializer

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {serviceId} = data
        const {user} = this.req
        const service = await Service.findOne({clientId: serviceId, userId: user.clientId})
        if(!service){
            this.sendResponse(400, {serviceId: "No Service Found"}, {messageClass: BadRequestMessage})
            return
        }

        const exisitingLogo = service.serviceLogo

        const {file} = this.req
        const cloudUpload = await imgToCloud(file.path)
        if(!cloudUpload){
            this.sendResponse(500, null, {messageClass: ServerErrorMessage})
            return
        }
        
        const {secure_url} = cloudUpload
        service.serviceLogo = secure_url
        await service.save()

        await this.cleanImage(exisitingLogo)
        this.sendResponse(200, service)
        return
    }

    async cleanImage(exisitingLogo){
        if(!exisitingLogo){
            return
        }
        try{
            const client = await getTemporalClient()
            const handle = await client.workflow.start('cleanImage', {
                args: [exisitingLogo],
                taskQueue: TemporalConfig.taskQueue,
                workflowId: `clean_image-${Date.now()}`,
            });
        }catch(err){
            console.log(`[UPLOAD SERVICE LOGO ERROR] - ${err.message}`)
        }
    }

}


export class ServiceUpdateController extends BaseController{
    jwt = true
    parser = serviceUpdateParser
    serializer = serviceSerializer
    method = "PUT"

    async handleRequest(){
        const data = this.parseData()
        if(!data){
            return
        }

        const {serviceId, serviceName} = data
        const {user} = this.req

        const service = await Service.findOne({clientId: serviceId, userId: user.clientId})
        if(!service){
            const error = {clientId: "Service does not exist"}
            this.sendResponse(400, error, {messageClass: BadRequestMessage})
            return
        }
        
        // check new serviceName is not exisiting or not
        if(serviceName && service.serviceName !== serviceName){
            const serviceWithNewName = await Service.findOne({serviceName, userId: user.clientId})
            if(serviceWithNewName){
                const error = {serviceName: "Service Name is Already Exisiting"}
                this.sendResponse(400, error, {messageClass: BadRequestMessage})
                return
            }
        }
        
        let update = false
        for(let key in data){
            if(key != "serviceId" && data[key] !== undefined){
                service[key] = data[key]
                update = true
            }
        }

        if(update){
            await service.save()
        }
        
        this.sendResponse(200, service, {"message": "Success"})   
    }
}


export class ListServicesController extends BaseController{
    jwt = true
    serializer = listServicesSerializer
    method = "POST"

    async handleRequest(){
        const {user} = this.req
        const services = await Service.find({userId: user.clientId})    
        this.sendResponse(200, {services}, {"message": "Success"})   
    }
}
