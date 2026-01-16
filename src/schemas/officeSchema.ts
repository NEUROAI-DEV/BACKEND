import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const createOfficeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  officeName: Joi.string().max(100).required(),
  officeAddress: Joi.string().required(),
  officeLongitude: Joi.string().max(100).required(),
  officeLatitude: Joi.string().max(100).required(),
  officeMaximumDistanceAttendance: Joi.number().integer().positive().default(10),
  officeWifiMacAddress: Joi.string().max(250).optional()
})

export const updateOfficeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  officeId: Joi.number().integer().positive().required(),
  officeName: Joi.string().allow('').max(100).optional(),
  officeAddress: Joi.string().allow('').required(),
  officeLongitude: Joi.string().allow('').max(100).optional(),
  officeLatitude: Joi.string().allow('').max(100).optional(),
  officeMaximumDistanceAttendance: Joi.number()
    .integer()
    .positive()
    .default(10)
    .optional(),
  officeWifiMacAddress: Joi.string().allow('').max(250).optional()
})

export const removeOfficeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  officeId: Joi.number().integer().positive().required()
})

export const findDetailOfficeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  officeId: Joi.number().integer().positive().required()
})

export const findAllOfficeSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})

export const findAllOfficeLocationSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional()
})
