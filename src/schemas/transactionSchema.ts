import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const updateTransactionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  transactionId: Joi.number().integer().positive().required()
})

export const createTransactionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  transactionBillingPlanId: Joi.number().integer().positive().required(),
  transactionDurationMonth: Joi.number().integer().positive().required(),
  transactionTotalUser: Joi.number().integer().positive().required(),
  transactionTotalPrice: Joi.number().integer().positive().required(),
  transactionTotalDiscount: Joi.number().integer().optional().allow('', 0),
  transactionDescription: Joi.string().optional().allow('')
})

export const findDetailTransactionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema
})

export const findAllTransactionSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})
