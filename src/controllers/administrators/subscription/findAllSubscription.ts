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
import { SubscriptionModel } from '../../../models/subsriptionModel'
import { ISubscriptionFindAllRequest } from '../../../interfaces/subscription/subscription.request'
import { membershipFindAllSchema } from '../../../schemas/membershipSchema'
import { CompanyModel } from '../../../models/companyModel'

export const findAllSubscription = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    membershipFindAllSchema,
    req.query
  ) as {
    error: ValidationError
    value: ISubscriptionFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination, search } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await SubscriptionModel.findAndCountAll({
      where: {
        deleted: 0
        // ...(Boolean(search) && {
        //   [Op.or]: [{ s: { [Op.like]: `%${search}%` } }]
        // })
      },
      include: [{ model: CompanyModel, as: 'company' }],
      order: [['subscriptionId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Subscription retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
