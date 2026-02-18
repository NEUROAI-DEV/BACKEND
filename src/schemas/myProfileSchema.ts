import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

/* ============================= */
/* UPDATE MY PROFILE (body) */
/* ============================= */

export const updateMyProfileSchema = z.object({
  userName: z.string().min(3).max(30).optional().or(z.literal('')),
  userPassword: z.string().min(6).max(128).optional().or(z.literal('')),
  userEmail: stringAllowEmpty().optional()
})

export type UpdateMyProfileInput = z.infer<typeof updateMyProfileSchema>

/* ============================= */
/* UPDATE ONBOARDING (body) */
/* ============================= */

export const updateOnboardingSchema = z.object({
  userOnboardingStatus: z.enum(['waiting', 'completed'])
})

export type UpdateOnboardingInput = z.infer<typeof updateOnboardingSchema>
