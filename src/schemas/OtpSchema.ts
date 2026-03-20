import { z } from 'zod'

export const requestOtpSchema = z.object({
  userEmail: z.string(),
  otpType: z.enum(['register', 'reset'])
})

export const verifyOtpSchema = z.object({
  userEmail: z.string(),
  otpCode: z.string().max(100)
})

export type IRequestOtp = z.infer<typeof requestOtpSchema>
export type IVerifyOtp = z.infer<typeof verifyOtpSchema>
