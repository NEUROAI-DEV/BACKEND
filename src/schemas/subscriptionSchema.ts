// src/schema/subscriptionSchema.ts
import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const createSubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  subscriptionCompanyId: Joi.number().integer().positive().required(),
  subscriptionBillingPlanId: Joi.number().integer().positive().required(),
  subscriptionPlanName: Joi.string().required(),
  subscriptionPriceMonthly: Joi.number().positive().required(),
  subscriptionMaxUsers: Joi.number().integer().positive().required(),
  subscriptionMaxOffices: Joi.number().integer().positive().required(),
  subscriptionStatus: Joi.string().valid('active', 'inactive', 'cancelled').required(),
  subscriptionStartDate: Joi.date().required(),
  subscriptionEndDate: Joi.date().required(),
  subscriptionNextBillingDate: Joi.date().required(),
  subscriptionBillingCycle: Joi.string().valid('monthly', 'yearly').required()
})

export const updateSubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  subscriptionId: Joi.number().integer().positive().required(),
  subscriptionPlanName: Joi.string().allow('').optional(),
  subscriptionPriceMonthly: Joi.number().positive().optional(),
  subscriptionMaxUsers: Joi.number().integer().positive().optional(),
  subscriptionMaxOffices: Joi.number().integer().positive().optional(),
  subscriptionStatus: Joi.string().valid('active', 'inactive', 'cancelled').optional(),
  subscriptionStartDate: Joi.date().optional(),
  subscriptionEndDate: Joi.date().optional(),
  subscriptionNextBillingDate: Joi.date().optional(),
  subscriptionBillingCycle: Joi.string().valid('monthly', 'yearly').optional()
})

export const removeSubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  subscriptionId: Joi.number().integer().positive().required()
})

export const findDetailSubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  subscriptionId: Joi.number().integer().positive().required()
})

export const findAllSubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})

export const findMySubscriptionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema
})
