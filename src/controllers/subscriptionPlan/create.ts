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
    const payload = req.body as ICreateSubscriptionPlan
    const plan = await SubscriptionPlanService.create({
      subscriptionPlanName: payload.subscriptionPlanName,
      subscriptionPlanOrder: payload.subscriptionPlanOrder,
      subscriptionPlanDescription: payload.subscriptionPlanDescription ?? '',
      subscriptionPlanPriceMonthly: payload.subscriptionPlanPriceMonthly,
      subscriptionPlanPriceYearly: payload.subscriptionPlanPriceYearly ?? 0,
      subscriptionPlanInterval: payload.subscriptionPlanInterval,
      subscriptionPlanCategory: payload.subscriptionPlanCategory
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
