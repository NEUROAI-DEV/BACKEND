import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const createAttendanceSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  attendanceScheduleId: Joi.number().integer().positive().required(),
  attendanceOfficeId: Joi.number().integer().positive().required(),
  attendancePhoto: Joi.string().optional().allow(''),
  attendanceCategory: Joi.string()
    .valid('checkin', 'checkout', 'breakin', 'breakout', 'otin', 'otout')
    .required(),
  attendanceLatitude: Joi.number().optional().allow(''),
  attendanceLongitude: Joi.number().optional().allow(''),
  attendanceDistanceFromOffice: Joi.number().optional().allow('')
})

export const findDetailAttendanceSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  attendanceId: Joi.number().integer().positive().required()
})

export const findLastAttendanceSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  scheduleId: Joi.number().integer().positive().required()
})

export const findAllLastStatusAttendanceSchema = Joi.object({
  jwtPayload: jwtPayloadSchema
})

export const findAllAttendanceSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional(),
  startDate: Joi.string().allow('').optional(),
  endDate: Joi.string().allow('').optional(),
  attendanceScheduleId: Joi.number().integer().positive().optional(),
  officeId: Joi.alternatives()
    .try(Joi.number(), Joi.string().empty(''))
    .optional()
    .allow(null),
  attendanceCategory: Joi.string()
    .valid('checkin', 'checkout', 'breakin', 'breakout', 'otin', 'otout')
    .optional()
    .allow('')
})

export const findDetailAttendanceHistorySchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  attendanceHistoryId: Joi.number().integer().positive().required()
})

export const findAllAttendanceHistoriesSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  page: Joi.number().integer().optional(),
  size: Joi.number().integer().optional(),
  search: Joi.string().allow('').optional(),
  pagination: Joi.boolean().optional(),
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  attendanceHistoryUserId: Joi.number().integer().positive().optional().allow(''),
  attendanceHistoryScheduleId: Joi.number().integer().positive().optional().allow('')
})
