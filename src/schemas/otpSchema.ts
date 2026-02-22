import { z } from 'zod'

export const RequestOtpSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(/^[0-9]+$/)
    .min(10)
    .max(15),
  otpType: z.enum(['register', 'reset'])
})

export const VerifyOtpSchema = z.object({
  whatsappNumber: z
    .string()
    .regex(/^[0-9]+$/)
    .min(10)
    .max(15),
  otpCode: z.string().max(100)
})

export type IRequestOtp = z.infer<typeof RequestOtpSchema>
export type IVerifyOtp = z.infer<typeof VerifyOtpSchema>
