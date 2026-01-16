import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const createScheduleSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  scheduleName: Joi.string().max(100).required(),
  scheduleOfficeId: Joi.number().integer().positive().required(),
  scheduleStartDate: Joi.string().required(),
  scheduleEndDate: Joi.string().required()
})

export const updateScheduleSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  scheduleId: Joi.number().integer().positive().required(),
  scheduleStart: Joi.string().allow(null, '').optional(),
  scheduleEnd: Joi.string().allow(null, '').optional(),
  scheduleCategory: Joi.string().valid('regular', 'libur').default('regular').optional()
})

export const removeScheduleSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  scheduleId: Joi.number().integer().positive().required()
})

export const findDetailScheduleSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  scheduleId: Joi.number().integer().positive().required()
})

export const findAllScheduleSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  scheduleStatus: Joi.string()
    .valid('waiting', 'progress', 'swap', 'done')
    .allow('')
    .optional(),
  scheduleStatusNot: Joi.string()
    .valid('waiting', 'progress', 'swap', 'done')
    .allow('')
    .optional(),
  pagination: Joi.boolean().optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  officeId: Joi.number().allow('').optional()
})
