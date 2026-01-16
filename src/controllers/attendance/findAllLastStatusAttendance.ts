import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AttendanceModel } from '../../models/attendanceModel'
import { findAllLastStatusAttendanceSchema } from '../../schemas/attendanceSchema'
import { ScheduleModel } from '../../models/scheduleModel'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { OfficeModel } from '../../models/officeModel'
import logger from '../../logs'
import { IAttendanceFindAllRequest } from '../../interfaces/attendances/attendance.request'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllLastStatusAttendance = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllLastStatusAttendanceSchema,
    req.query
  ) as {
    error: ValidationError
    value: IAttendanceFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const result = await AttendanceModel.findAll({
      where: {
        deleted: 0,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId
      },
      attributes: ['attendanceId', 'attendanceCategory'],
      include: [
        {
          model: OfficeModel,
          as: 'office'
        },
        {
          model: ScheduleModel,
          as: 'schedule',
          attributes: [
            'scheduleId',
            'scheduleName',
            'scheduleStartDate',
            'scheduleEndDate',
            'scheduleStatus'
          ]
        }
      ],

      order: [['attendanceId', 'desc']],
      limit: 1
    })

    // if (result == null) {
    //   const message = `Attendance not found with ID: ${value.scheduleId}`
    //   logger.warn(message)
    //   return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error(message))
    // }

    const response = ResponseData.success({ data: result })
    logger.info('Attendance found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
