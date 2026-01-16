import { type Response } from 'express'
import moment from 'moment'
import { AttendanceModel } from '../../models/attendanceModel'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { findProductivitiesSchema } from '../../schemas/statisticSchema'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IStatisticProductivity } from '../../interfaces/statistic/statistic.request'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const productivities = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findProductivitiesSchema,
    req.query
  ) as {
    error: ValidationError
    value: IStatisticProductivity
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const attendances = await AttendanceModel.findAll({
      where: {
        attendanceCompanyId: req?.membershipPayload?.membershipCompanyId,
        ...(Boolean(req.body?.jwtPayload?.userRole === 'user') && {
          attendanceUserId: req.body?.jwtPayload?.userId
        }),
        ...(Boolean(validatedData.attendanceScheduleId) && {
          attendanceScheduleId: validatedData.attendanceScheduleId
        }),
        ...(Boolean(validatedData.attendanceUserId) && {
          attendanceUserId: validatedData.attendanceUserId
        })
      },
      order: [['attendanceTime', 'ASC']]
    })

    let filteredByTime = [...attendances]

    // Filter berdasarkan attendanceTimeRange
    if (validatedData.attendanceTimeRange) {
      const now = moment()

      filteredByTime = attendances.filter((record) => {
        const date = moment(record.attendanceTime)

        switch (validatedData.attendanceTimeRange) {
          case 'today':
            return date.isSame(now, 'day')
          case 'thisWeek':
            return date.isSame(now, 'week')
          case 'thisMonth':
            return date.isSame(now, 'month')
          case 'thisYear':
            return date.isSame(now, 'year')
          default:
            return true
        }
      })
    }

    // Group by date
    const groupedByDate: Record<string, any[]> = {}

    filteredByTime.forEach((record) => {
      const date = moment(record.attendanceTime).format('YYYY-MM-DD')
      if (!groupedByDate[date]) groupedByDate[date] = []
      groupedByDate[date].push(record)
    })

    let totalWorkMs = 0
    let totalBreakMs = 0
    let totalOvertimeMs = 0

    for (const date in groupedByDate) {
      const dayRecords = groupedByDate[date]

      const checkins = dayRecords.filter((r) => r.attendanceCategory === 'checkin')
      const checkouts = dayRecords.filter((r) => r.attendanceCategory === 'checkout')

      const breakins = dayRecords.filter((r) => r.attendanceCategory === 'breakin')
      const breakouts = dayRecords.filter((r) => r.attendanceCategory === 'breakout')

      const otins = dayRecords.filter((r) => r.attendanceCategory === 'otin')
      const otouts = dayRecords.filter((r) => r.attendanceCategory === 'otout')

      // Work Time
      if (checkins.length && checkouts.length) {
        const workStart = moment(checkins[0].attendanceTime)
        const workEnd = moment(checkouts[checkouts.length - 1].attendanceTime)

        if (workEnd.isAfter(workStart)) {
          let workDuration = workEnd.diff(workStart, 'milliseconds')

          // Subtract breaks
          breakins.forEach((breakin, i) => {
            const breakout = breakouts[i]
            if (breakout) {
              const start = moment(breakin.attendanceTime)
              const end = moment(breakout.attendanceTime)
              if (end.isAfter(start)) {
                const duration = end.diff(start, 'milliseconds')
                workDuration -= duration
                totalBreakMs += duration
              }
            }
          })

          if (workDuration > 0) {
            totalWorkMs += workDuration
          }
        }
      }

      // Overtime
      otins.forEach((otin, i) => {
        const otout = otouts[i]
        if (otout) {
          const start = moment(otin.attendanceTime)
          const end = moment(otout.attendanceTime)
          if (end.isAfter(start)) {
            const duration = end.diff(start, 'milliseconds')
            totalOvertimeMs += duration
          }
        }
      })
    }

    // const result = {
    //   totalWorkTime: moment.utc(totalWorkMs).format('HH:mm:ss'),
    //   totalBreakTime: moment.utc(totalBreakMs).format('HH:mm:ss'),
    //   totalOvertime: moment.utc(totalOvertimeMs).format('HH:mm:ss')
    // }

    const convertMsToDecimalHours = (milliseconds: number): number => {
      return parseFloat((milliseconds / (1000 * 60 * 60)).toFixed(2))
    }

    const result = {
      totalWorkTimeInHour: convertMsToDecimalHours(totalWorkMs),
      totalBreakTimeInHour: convertMsToDecimalHours(totalBreakMs),
      totalOverTimeInHour: convertMsToDecimalHours(totalOvertimeMs)
    }

    const response = ResponseData.success({ data: result })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
