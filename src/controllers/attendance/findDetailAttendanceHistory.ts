import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import { AttendanceModel } from '../../models/attendanceModel'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../logs'
import { IAttendanceHistoryFindDetailRequest } from '../../interfaces/attendances/attendance.request'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findDetailAttendanceHistorySchema } from '../../schemas/attendanceSchema'

export const findDetailAttendanceHistory = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findDetailAttendanceHistorySchema,
    req.params
  ) as {
    error: ValidationError
    value: IAttendanceHistoryFindDetailRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await AttendanceModel.findAndCountAll({
      where: {
        deleted: 0,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        attendanceId: validatedData.attendanceHistoryId
      },

      order: [['attendanceId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Attendance history retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
