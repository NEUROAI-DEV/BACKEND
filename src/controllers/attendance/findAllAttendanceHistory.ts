import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import { Op } from 'sequelize'
import { AttendanceModel } from '../../models/attendanceModel'
import { ScheduleModel } from '../../models/scheduleModel'
import { ValidationError } from 'joi'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { IAttendanceHistoryFindAllRequest } from '../../interfaces/attendances/attendance.request'
import { OfficeModel } from '../../models/officeModel'
import { UserModel } from '../../models/userModel'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findAllAttendanceHistoriesSchema } from '../../schemas/attendanceSchema'

export const findAllAttendanceHistories = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllAttendanceHistoriesSchema,
    req.query
  ) as {
    error: ValidationError
    value: IAttendanceHistoryFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const {
      page: queryPage,
      size: querySize,
      pagination,
      startDate,
      endDate,
      attendanceHistoryUserId,
      search
    } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const whereConditions: any = {
      deleted: 0,
      ...(Boolean(req?.jwtPayload?.userRole === 'user') && {
        attendanceUserId: req?.jwtPayload?.userId
      })
    }

    if (startDate && endDate) {
      whereConditions.attendanceTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    }

    if (search) {
      whereConditions[Op.or] = [{ attendanceCategory: { [Op.like]: `%${search}%` } }]
    }

    const result = await AttendanceModel.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: OfficeModel,
          as: 'office',
          attributes: [
            'officeId',
            'officeName',
            'officeAddress',
            'officeLongitude',
            'officeLatitude'
          ]
        },
        {
          model: ScheduleModel,
          as: 'schedule'
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
      ],
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
