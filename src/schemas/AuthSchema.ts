import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

export const UserLoginSchema = z.object({
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export const UserRegistrationSchema = z.object({
  userName: stringAllowEmpty().optional(),
  userEmail: z.string().min(1),
  userPassword: z.string().min(6)
})

export const UserUpdateSchema = z.object({
  userPassword: z.string().min(6),
  userEmail: z.string().min(1)
})

export const AdminRegisterSchema = z.object({
  userName: z.string().max(100).min(1),
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export const AdminLoginSchema = z.object({
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export const AdminUpdateSchema = z.object({
  userPassword: z.string().min(6),
  userEmail: z.string().min(1)
})

export type IAdminUpdate = z.infer<typeof AdminUpdateSchema>
export type IUserLogin = z.infer<typeof UserLoginSchema>
export type IUserUpdate = z.infer<typeof UserUpdateSchema>
export type IUserRegistration = z.infer<typeof UserRegistrationSchema>
export type IAdminLogin = z.infer<typeof AdminLoginSchema>
export type IAdminRegister = z.infer<typeof AdminRegisterSchema>
