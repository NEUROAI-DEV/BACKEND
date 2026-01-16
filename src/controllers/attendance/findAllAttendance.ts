import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import { Op, Sequelize } from 'sequelize'
import { AttendanceModel } from '../../models/attendanceModel'
import { findAllAttendanceSchema } from '../../schemas/attendanceSchema'
import { ScheduleModel } from '../../models/scheduleModel'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IAttendanceFindAllRequest } from '../../interfaces/attendances/attendance.request'
import { OfficeModel } from '../../models/officeModel'
import { UserModel } from '../../models/userModel'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllAttendance = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllAttendanceSchema,
    req.query
  ) as {
    error: ValidationError
    value: IAttendanceFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const {
      page: queryPage,
      size: querySize,
      pagination,
      search,
      startDate,
      endDate,
      attendanceCategory,
      attendanceScheduleId,
      officeId
    } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const dateFilter =
      startDate && endDate
        ? {
            createdAt: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          }
        : {}

    const result = await AttendanceModel.findAndCountAll({
      where: {
        deleted: 0,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        ...(Boolean(req?.jwtPayload?.userRole === 'user') && {
          attendanceUserId: req?.jwtPayload?.userId
        }),
        ...(Boolean(attendanceCategory) && {
          attendanceCategory: attendanceCategory
        }),
        ...(Boolean(attendanceScheduleId) && {
          attendanceScheduleId: attendanceScheduleId
        }),
        ...(Boolean(officeId) && {
          attendanceOfficeId: officeId
        }),
        ...dateFilter
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
          ],
          where: search
            ? {
                [Op.or]: [
                  Sequelize.where(Sequelize.col('user.user_name'), 'LIKE', `%${search}%`)
                ]
              }
            : undefined
        }
      ],
      order: [['attendanceId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      }),
      distinct: true
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Attendance records retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
