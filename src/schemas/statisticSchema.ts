import Joi from 'joi'
import { jwtPayloadSchema } from './jwtPayloadSchema'

export const findProductivitiesSchema = Joi.object({
  jwtPayload: jwtPayloadSchema,
  attendanceScheduleId: Joi.number().optional(),
  attendanceUserId: Joi.number().optional(),
  attendanceTimeRange: Joi.string()
    .valid('today', 'thisWeek', 'thisMonth', 'thisYear')
    .optional()
})
