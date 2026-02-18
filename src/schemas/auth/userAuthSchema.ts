import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

export const userLoginSchema = z.object({
  userEmail: z.string().min(1),
  userPassword: z.string().min(1)
})

export type UserLoginInput = z.infer<typeof userLoginSchema>

export const employeeRegistrationSchema = z.object({
  userName: stringAllowEmpty().optional(),
  userEmail: z.string().min(1),
  userPassword: z.string().min(6)
})

export type EmployeeRegistrationInput = z.infer<typeof employeeRegistrationSchema>

export const userUpdatePasswordSchema = z.object({
  userPassword: z.string().min(6),
  userEmail: z.string().min(1)
})

export type UserUpdatePasswordInput = z.infer<typeof userUpdatePasswordSchema>
