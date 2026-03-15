import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionPlanService } from '../../services/SubscriptionPlanService'
import type { IFindAllSubscriptionPlan } from '../../schemas/SubscriptionPlanSchema'

export const findAllSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllSubscriptionPlan
    const result = await SubscriptionPlanService.findAll({
      page: query.page,
      size: query.size
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.totalItems,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages
      }
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
