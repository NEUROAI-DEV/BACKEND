import { type Response, type NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'
import { Op } from 'sequelize'
import { ResponseData } from '../utilities/response'
import { SubscriptionModel } from '../models/subsriptionModel'
import { handleServerError } from '../utilities/requestHandler'
import { IAuthenticatedRequest } from '../interfaces/shared/request.interface'
import logger from '../logs'

export const subscriptionCheck = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const subscription = await SubscriptionModel.findOne({
      where: {
        subscriptionCompanyId: req.membershipPayload?.membershipCompanyId,
        subscriptionStatus: 'active',
        deleted: { [Op.eq]: 0 }
      },
      order: [['subscriptionEndDate', 'DESC']]
    })

    if (!subscription) {
      const message = 'No active subscription found for this company.'
      logger.error(message)

      const response = ResponseData.error({ message })
      return res.status(StatusCodes.PAYMENT_REQUIRED).json(response)
    }

    const today = moment().startOf('day')
    const endDate = moment(subscription.subscriptionEndDate).startOf('day')

    if (endDate.isBefore(today)) {
      const message =
        'Your subscription has expired. Please renew to continue using our services.'
      logger.error(message)

      const response = ResponseData.error({ message })
      return res.status(StatusCodes.PAYMENT_REQUIRED).json(response)
    }

    next()
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
