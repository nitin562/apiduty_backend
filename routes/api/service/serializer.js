import { z } from "zod";

export const createServiceSerializer = z.object({
    clientId: z.string(),
    serviceName: z.string(),
    serviceDescription: z.string(),
    serviceState: z.string(),
    serviceStatus: z.any(),
    serviceToken: z.string(),
    serviceKey: z.string(),
});

export const uploadServiceLogoSerializer = z.object({
    clientId: z.string(),
    serviceLogo: z.string()
});

export const serviceSerializer = z.object({
    clientId: z.string(),
    serviceName: z.string(),
    serviceDescription: z.string(),
    serviceState: z.string(),
    serviceStatus: z.any(),
    serviceToken: z.string(),
    serviceKey: z.string(),
    serviceLogo: z.string().default("")
});

export const listServicesSerializer = z.object({
    services: z.array(serviceSerializer)
})
