import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { ScheduleModel } from '../../models/scheduleModel'
import { createAttendanceSchema } from '../../schemas/attendanceSchema'
import moment from 'moment'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IAttendanceCreateRequest } from '../../interfaces/attendances/attendance.request'
import logger from '../../logs'
import { AttendanceModel } from '../../models/attendanceModel'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const createAttendance = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    createAttendanceSchema,
    req.body
  ) as {
    error: ValidationError
    value: IAttendanceCreateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const scheduleRecord = await ScheduleModel.findOne({
      where: {
        deleted: 0,
        scheduleId: validatedData.attendanceScheduleId,
        scheduleCompanyId: req?.membershipPayload?.membershipCompanyId,
        scheduleOfficeId: validatedData?.attendanceOfficeId
      }
    })

    if (scheduleRecord === null) {
      const message = 'Schedule not found'
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const attendanceRecord = await AttendanceModel.findOne({
      where: {
        deleted: 0,
        attendanceScheduleId: validatedData.attendanceScheduleId,
        attendanceCategory: validatedData.attendanceCategory
      }
    })

    // pritend duplicate attendance category
    if (attendanceRecord === null) {
      validatedData.attendanceTime = moment().toISOString()
      validatedData.attendanceUserId = req?.jwtPayload?.userId!
      validatedData.attendanceCompanyId = req?.membershipPayload?.membershipCompanyId

      await AttendanceModel.create(validatedData)
    }

    const response = ResponseData.success({})

    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
