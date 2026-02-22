import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

export const UpdateMyProfileSchema = z.object({
  userName: z.string().min(3).max(30).optional().or(z.literal('')),
  userPassword: z.string().min(6).max(128).optional().or(z.literal('')),
  userEmail: stringAllowEmpty().optional()
})

export const UpdateOnboardingSchema = z.object({
  userOnboardingStatus: z.enum(['waiting', 'completed'])
})

export type IUpdateMyProfile = z.infer<typeof UpdateMyProfileSchema>
export type IUpdateOnboarding = z.infer<typeof UpdateOnboardingSchema>
