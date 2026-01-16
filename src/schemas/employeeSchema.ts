import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const findAllEmployeeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().min(0).default(0).optional(),
  size: Joi.number().integer().min(1).default(10).optional(),
  userRole: Joi.string().allow('').optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().default(true).optional(),
  employeeId: Joi.string().optional().allow('')
})

export const findDetailEmployeeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  employeeId: Joi.string().required()
})

export const updateEmployeeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  userId: Joi.number(),
  userDeviceId: Joi.string().optional().allow(''),
  userWhatsappNumber: Joi.string().allow('').optional()
})
