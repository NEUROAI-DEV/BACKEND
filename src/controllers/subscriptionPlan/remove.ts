import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionPlanService } from '../../services/SubscriptionPlanService'
import type { IRemoveSubscriptionPlan } from '../../schemas/SubscriptionPlanSchema'

export const removeSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IRemoveSubscriptionPlan
    await SubscriptionPlanService.remove(body.subscriptionPlanId)

    const response = ResponseData.success({
      data: null,
      message: 'Subscription plan deleted successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
