import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const billingPlanCategoryEnum = ['trial', 'subscription', 'custom'] as const

export const createBillingPlanSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  billingPlanName: Joi.string().max(100).required(),
  billingPlanCategory: Joi.string()
    .valid(...billingPlanCategoryEnum)
    .required(),
  billingPlanPricePerUser: Joi.number().min(1).required(),
  billingPlanDurationMonth: Joi.number().integer().min(1).required(),
  billingPlanDiscountPercentage: Joi.number().integer().min(1).required()
})

export const updateBillingPlanSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  billingPlanId: Joi.number().integer().positive().required(),
  billingPlanName: Joi.string().max(100).optional(),
  billingPlanCategory: Joi.string()
    .valid(...billingPlanCategoryEnum)
    .required(),
  billingPlanPricePerUser: Joi.number().optional(),
  billingPlanDurationMonth: Joi.number().integer().optional(),
  billingPlanDiscountPercentage: Joi.number().integer().optional()
})

export const findAllBillingPlanSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().min(1).optional(),
  size: Joi.number().integer().min(1).optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})

export const findDetailBillingPlanSchema = Joi.object({
  jwtPayload: jwtPayloadSchema
})

export const removeBillingPlanSchema = Joi.object({
  jwtPayload: jwtPayloadSchema
})
