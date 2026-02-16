import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const createScreenerSchema = Joi.object({
  screenerCoinSymbol: Joi.string().max(100).required().trim(),
  screenerProfile: Joi.string().valid('SCALPING', 'SWING', 'INVEST').required(),
  screenerCoinImage: Joi.string().max(255).optional().trim().allow('')
})

export const findAllScreenerSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})

export const removeScreenerSchema = Joi.object({
  screenerId: Joi.number().integer().positive().required()
})
