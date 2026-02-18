import { z } from 'zod'

export const adminRegisterSchema = z.object({
  userName: z.string().max(100).min(1),
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>

export const adminLoginSchema = z.object({
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

export const updatePasswordSchema = z.object({
  userPassword: z.string().min(6),
  userEmail: z.string().min(1)
})

export type AdminUpdatePasswordInput = z.infer<typeof updatePasswordSchema>
