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
import { IBillingPlanUpdateRequest } from '../../../interfaces/billingPlan/billingPlan.request'
import { updateBillingPlanSchema } from '../../../schemas/billingPlanSchema'
import { BillingPlanModel } from '../../../models/billingPlanModel'

export const updateBillingPlan = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    updateBillingPlanSchema,
    req.body
  ) as {
    error: ValidationError
    value: IBillingPlanUpdateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const office = await BillingPlanModel.findOne({
      where: {
        deleted: 0,
        billingPlanId: validatedData?.billingPlanId
      }
    })

    if (office === null) {
      const message = `Billing plan not found with ID: ${validatedData.billingPlanId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    await BillingPlanModel.update(validatedData, {
      where: {
        deleted: 0,
        billingPlanId: validatedData?.billingPlanId
      }
    })

    const response = ResponseData.success({
      message: 'Billing plan updated successfully'
    })
    logger.info('Billing plan updated successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
