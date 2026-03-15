import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionPlanService } from '../../services/SubscriptionPlanService'
import type { IUpdateSubscriptionPlan } from '../../schemas/SubscriptionPlanSchema'

export const updateSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as IUpdateSubscriptionPlan
    const plan = await SubscriptionPlanService.update(body.subscriptionPlanId, body)

    const response = ResponseData.success({
      data: plan,
      message: 'Subscription plan updated successfully.'
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
