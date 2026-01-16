import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import { Pagination } from '../../../utilities/pagination'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../../logs'
import { type IAuthenticatedRequest } from '../../../interfaces/shared/request.interface'
import { findAllBillingPlanSchema } from '../../../schemas/billingPlanSchema'
import { IBillingPlanFindAllRequest } from '../../../interfaces/billingPlan/billingPlan.request'
import { BillingPlanModel } from '../../../models/billingPlanModel'

export const findAllBillingPlan = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllBillingPlanSchema,
    req.query
  ) as {
    error: ValidationError
    value: IBillingPlanFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination, search } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await BillingPlanModel.findAndCountAll({
      where: {
        deleted: 0
      },
      order: [['billingPlanId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Billing Plan retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
