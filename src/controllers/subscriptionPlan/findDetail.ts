import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionPlanService } from '../../services/SubscriptionPlanService'
import type { IFindDetailSubscriptionPlan } from '../../schemas/SubscriptionPlanSchema'

export const findDetailSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.params as unknown as IFindDetailSubscriptionPlan
    const plan = await SubscriptionPlanService.findDetail(params.subscriptionPlanId)

    const response = ResponseData.success({
      data: plan
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
