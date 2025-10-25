import {z} from "zod"

export const pingSerializer = z.object({
    email: z.email(),
    username: z.string(),
    login: z.boolean().default(false),
})

export const loginSerializer = z.object({
    email: z.email(),
    username: z.string(),
    login: z.boolean().default(false),
})

export const RegisterSerializer = z.object({
    email: z.email(),
    registered: z.boolean().default(false),
    createdAt: z.date()
})

export const RefreshTokenSerializer = z.object({
    email: z.email(),
    refreshed: z.boolean().default(false),
    updatedAt: z.date()
})
