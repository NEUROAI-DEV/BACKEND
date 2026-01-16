import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AttendanceModel } from '../../models/attendanceModel'
import { findLastAttendanceSchema } from '../../schemas/attendanceSchema'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IAttendanceFindLastRequest } from '../../interfaces/attendances/attendance.request'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findDetailLastStatusAttendance = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findLastAttendanceSchema,
    req.params
  ) as {
    error: ValidationError
    value: IAttendanceFindLastRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const result = await AttendanceModel.findOne({
      where: {
        deleted: 0,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        attendanceScheduleId: validatedData.scheduleId
      },
      order: [['attendanceId', 'desc']]
    })

    const response = ResponseData.success({ data: result })
    logger.info('Attendance found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
