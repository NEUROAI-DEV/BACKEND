import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { AttendanceModel } from '../../models/attendanceModel'
import { handleServerError } from '../../utilities/requestHandler'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { MembershipModel } from '../../models/membershipModel'
import { ScheduleModel } from '../../models/scheduleModel'
import { OfficeModel } from '../../models/officeModel'
import moment from 'moment'

export const findLastStatus = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const membership = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId,
        membershipUserId: req?.jwtPayload?.userId
      }
    })

    if (membership === null) {
      const message = `Membership not found `
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const schedule = await ScheduleModel.findOne({
      where: {
        deleted: 0,
        scheduleOfficeId: membership?.membershipOfficeId!,
        scheduleCompanyId: req?.membershipPayload?.membershipCompanyId,
        scheduleOrder: moment().day()
      }
    })

    if (schedule === null) {
      const response = ResponseData.success({})
      logger.info('Schedule  not found')
      return res.status(StatusCodes.OK).json(response)
    }

    const office = await OfficeModel.findOne({
      where: {
        deleted: 0,
        officeId: schedule?.scheduleOfficeId,
        officeCompanyId: req?.membershipPayload?.membershipCompanyId
      }
    })

    const attendance = await AttendanceModel.findOne({
      where: {
        deleted: 0,
        attendanceScheduleId: schedule?.scheduleId,
        attendanceUserId: req?.jwtPayload?.userId,
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        attendanceOfficeId: membership?.membershipOfficeId!
      },
      order: [['attendanceId', 'DESC']]
    })

    const payload = {
      ...schedule.dataValues,
      office,
      attendanceCategory: attendance?.attendanceCategory
        ? attendance?.attendanceCategory
        : 'menunggu'
    }

    const response = ResponseData.success({ data: payload })
    logger.info('Attendance found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
