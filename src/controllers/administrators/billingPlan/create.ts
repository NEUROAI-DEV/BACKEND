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
import { IAuthenticatedRequest } from '../../../interfaces/shared/request.interface'
import { BillingPlanModel } from '../../../models/billingPlanModel'
import { IBillingPlanAttributes } from '../../../interfaces/billingPlan/billingPlan.dto'
import { createBillingPlanSchema } from '../../../schemas/billingPlanSchema'

export const createBillingPlan = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    createBillingPlanSchema,
    req.body
  ) as {
    error: ValidationError
    value: IBillingPlanAttributes
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    await BillingPlanModel.create(validatedData)

    const response = ResponseData.success({})
    logger.info('Billing plan created successfully')
    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
