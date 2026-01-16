import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { OfficeModel } from '../../models/officeModel'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { MembershipModel } from '../../models/membershipModel'

export const findTotal = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const totalUsers = await MembershipModel.count({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId,
        membershipRole: 'employee'
      }
    })

    const totalOffice = await OfficeModel.count({
      where: {
        deleted: 0,
        officeCompanyId: req?.membershipPayload?.membershipCompanyId
      }
    })

    const response = ResponseData.success({
      data: {
        totalUsers,
        totalOffice
      }
    })

    logger.info('Statistic found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
