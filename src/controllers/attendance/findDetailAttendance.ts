import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AttendanceModel } from '../../models/attendanceModel'
import { findDetailAttendanceSchema } from '../../schemas/attendanceSchema'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IAttendanceFindDetailRequest } from '../../interfaces/attendances/attendance.request'
import { OfficeModel } from '../../models/officeModel'
import { UserModel } from '../../models/userModel'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findDetailAttendance = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findDetailAttendanceSchema,
    req.params
  ) as {
    error: ValidationError
    value: IAttendanceFindDetailRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const result = await AttendanceModel.findOne({
      where: {
        deleted: 0,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        attendanceId: validatedData.attendanceId
      },
      include: [
        {
          model: OfficeModel,
          as: 'office',
          attributes: [
            'officeId',
            'officeName',
            'officeAddress',
            'officeLongitude',
            'officeLatitude',
            'officeMaximumDistanceAttendance',
            'officeWifiMacAddress'
          ]
        },
        {
          model: UserModel,
          as: 'user',
          attributes: [
            'userId',
            'userName',
            'userRole',
            'userDeviceId',
            'userWhatsappNumber'
          ]
        }
      ]
    })

    if (result == null) {
      const message = `Attendance not found with ID: ${validatedData.attendanceId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const response = ResponseData.success({ data: result })
    logger.info('Schedule found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
