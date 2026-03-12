import { z } from 'zod'

export const CreateSubscriptionPlanSchema = z.object({
  subscriptionPlanName: z.string().min(1).max(100),
  subscriptionPlanOrder: z.coerce.number().int().nonnegative(),
  subscriptionPlanDescription: z.string().optional(),
  subscriptionPlanPriceMonthly: z.coerce.number().nonnegative(),
  subscriptionPlanPriceYearly: z.coerce.number().nonnegative().optional(),
  subscriptionPlanInterval: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY')
})

export const UpdateSubscriptionPlanSchema = z.object({
  subscriptionPlanId: z.coerce.number().int().positive(),
  subscriptionPlanName: z.string().min(1).max(100).optional(),
  subscriptionPlanOrder: z.coerce.number().int().nonnegative().optional(),
  subscriptionPlanDescription: z.string().optional(),
  subscriptionPlanPriceMonthly: z.coerce.number().nonnegative().optional(),
  subscriptionPlanPriceYearly: z.coerce.number().nonnegative().optional(),
  subscriptionPlanInterval: z.enum(['MONTHLY', 'YEARLY']).optional()
})

export const FindDetailSubscriptionPlanSchema = z.object({
  subscriptionPlanId: z.coerce.number().int().positive()
})

export const RemoveSubscriptionPlanSchema = z.object({
  subscriptionPlanId: z.coerce.number().int().positive()
})

export const FindAllSubscriptionPlanSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional()
})

export type IFindAllSubscriptionPlan = z.infer<typeof FindAllSubscriptionPlanSchema>
export type ICreateSubscriptionPlan = z.infer<typeof CreateSubscriptionPlanSchema>
export type IUpdateSubscriptionPlan = z.infer<typeof UpdateSubscriptionPlanSchema>
export type IFindDetailSubscriptionPlan = z.infer<typeof FindDetailSubscriptionPlanSchema>
export type IRemoveSubscriptionPlan = z.infer<typeof RemoveSubscriptionPlanSchema>
