import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../../logs'
import { type IAuthenticatedRequest } from '../../../interfaces/shared/request.interface'
import { SubscriptionModel } from '../../../models/subsriptionModel'
import { ISubscriptionUpdateRequest } from '../../../interfaces/subscription/subscription.request'
import { updateSubscriptionSchema } from '../../../schemas/subscriptionSchema'

export const updateSubscription = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    updateSubscriptionSchema,
    req.body
  ) as {
    error: ValidationError
    value: ISubscriptionUpdateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const company = await SubscriptionModel.findOne({
      where: {
        deleted: 0,
        subscriptionId: validatedData.subscriptionId
      }
    })

    if (company === null) {
      const message = `company not found`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    await SubscriptionModel.update(validatedData, {
      where: {
        deleted: 0,
        subscriptionId: validatedData?.subscriptionId
      }
    })

    const response = ResponseData.success({
      message: 'Subscription updated successfully'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
