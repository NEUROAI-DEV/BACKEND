import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../logs'
import { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { sequelize } from '../../database/config'
import { ITransacionCreateRequest } from '../../interfaces/transaction/transacrtion.request'
import { createTransactionSchema } from '../../schemas/transactionSchema'
import { BillingPlanModel } from '../../models/billingPlanModel'
import moment from 'moment'
import { TransactionModel } from '../../models/transactionModel'
import { ITransactionAttributes } from '../../interfaces/transaction/transaction.dto'

export const createTransaction = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    createTransactionSchema,
    req.body
  ) as {
    error: ValidationError
    value: ITransacionCreateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const transaction = await sequelize.transaction()

  try {
    const billingPlan = await BillingPlanModel.findOne({
      where: {
        deleted: 0,
        billingPlanId: validatedData?.transactionBillingPlanId
      },
      transaction
    })

    if (!billingPlan) {
      await transaction.rollback()
      const message = 'Billing plan not found'
      logger.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const dateNow = moment()

    const transacrtionReffererId = `${req?.jwtPayload?.userId}${req?.membershipPayload?.membershipCompanyId}${billingPlan?.billingPlanId}${dateNow.format('DDMMYYYY')}`

    const transactionPayload = {
      transactionBillingPlanId: billingPlan?.billingPlanId,
      transactionCompanyId: req?.membershipPayload?.membershipCompanyId,
      transactionUserId: req?.jwtPayload?.userId,
      transactionBillingPlanName: billingPlan?.billingPlanName,
      transactionTotalUser: validatedData.transactionTotalUser,
      transactionTotalPrice: validatedData?.transactionTotalPrice,
      transactionDescription: validatedData?.transactionDescription,
      transactionDurationMonth: validatedData?.transactionDurationMonth,
      transactionTotalDiscount: validatedData?.transactionTotalDiscount,
      transactionPlanCategory: 'subscription',
      transactionStatus: 'unpaid',
      transactionMethod: 'manual',
      transactionReferenceId: transacrtionReffererId,
      transactionPaidAt: dateNow.toDate(),
      transactionDueDate: dateNow.clone().add(7, 'days').toDate()
    } as unknown as ITransactionAttributes

    await TransactionModel.create(transactionPayload, {
      transaction
    })

    await transaction.commit()
    const response = ResponseData.success({})
    logger.info('Transaction created successfully')
    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    await transaction.rollback()
    return handleServerError(res, serverError)
  }
}
