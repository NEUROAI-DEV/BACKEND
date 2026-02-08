import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const findAllNewsSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional(),
  startDate: Joi.string().optional().allow(''),
  endDate: Joi.string().optional().allow('')
})

export const findDetailNewsSchema = Joi.object({
  newsId: Joi.number().integer().positive().required()
})
