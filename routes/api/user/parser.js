import {z} from "zod"

export const loginParser = z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(5, "Password must be atleast of 5 characters")
})

export const RegisterParser = z.object({
    username: z.string().min(3, "Username must be atleast of 3 characters"),
    email: z.email("Invalid Email"),
    password: z.string().min(5, "Password must be atleast of 5 characters")
})

export const RefreshTokenParser = z.object({
    refreshToken: z.string().nonempty("Token is Required")
})
