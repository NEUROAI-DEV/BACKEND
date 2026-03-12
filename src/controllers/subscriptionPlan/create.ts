import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionPlanService } from '../../services/SubscriptionPlanService'
import type { ICreateSubscriptionPlan } from '../../schemas/SubscriptionPlanSchema'

export const createSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as ICreateSubscriptionPlan
    const plan = await SubscriptionPlanService.create({
      subscriptionPlanName: body.subscriptionPlanName,
      subscriptionPlanOrder: body.subscriptionPlanOrder,
      subscriptionPlanDescription: body.subscriptionPlanDescription ?? '',
      subscriptionPlanPriceMonthly: body.subscriptionPlanPriceMonthly,
      subscriptionPlanPriceYearly: body.subscriptionPlanPriceYearly ?? 0,
      subscriptionPlanInterval: body.subscriptionPlanInterval
    })

    const response = ResponseData.success({
      data: plan,
      message: 'Subscription plan created successfully.'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
