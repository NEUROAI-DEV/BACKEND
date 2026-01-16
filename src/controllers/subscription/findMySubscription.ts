import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { findMySubscriptionSchema } from '../../schemas/subscriptionSchema'
import { SubscriptionModel } from '../../models/subsriptionModel'
import { IFindMySubscriptionRequest } from '../../interfaces/subscription/subscription.request'
import { MembershipModel } from '../../models/membershipModel'

export const findMySubscription = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findMySubscriptionSchema,
    req.query
  ) as {
    error: ValidationError
    value: IFindMySubscriptionRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const membership = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId,
        membershipUserId: req?.jwtPayload?.userId
      }
    })

    if (membership == null) {
      const message = 'membership not found!'
      const response = ResponseData.error({ message })
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const result = await SubscriptionModel.findOne({
      where: {
        deleted: 0,
        subscriptionCompanyId: req?.membershipPayload?.membershipCompanyId
      }
    })

    if (result == null) {
      const message = 'Subscription not found!'
      const response = ResponseData.error({ message })
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const response = ResponseData.success({ data: result })
    logger.info('Subscription found successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
