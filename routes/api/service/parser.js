import {z} from "zod"

const SERVICE_STATUS_CHOICE = ["CRITICAL", "HIGH", "MEDIUM", "NORMAL", "LOW"]
const SERVICE_STATE = ["ON", "OFF"]

export const createServiceParser = z.object({
    serviceName: z.string().nonempty("Service Name is Required").max(20, "Service Name must be in Range of 0-20 Characters"),
    serviceDescription: z.string().nonempty("Description is Required"),
    serviceStatus: z.enum(SERVICE_STATUS_CHOICE).default("NORMAL"),
    serviceState: z.enum(SERVICE_STATE).default("ON"),
})

export const uploadServiceLogoParser = z.object({
    serviceId: z.string().nonempty("Service ID is required"),
    mimetype: z.string("Image File is Required").startsWith("image/", "Provide Only Image File")
})

export const serviceUpdateParser = z.object({
    serviceId: z.string("Client ID is Required"),
    serviceName: z.string().max(20, "Service Name must be in Range of 0-20 Characters").optional(),
    serviceDescription: z.string().optional(),
    serviceStatus: z.enum(SERVICE_STATUS_CHOICE).optional(),
    serviceState: z.enum(SERVICE_STATE).optional(),
})
