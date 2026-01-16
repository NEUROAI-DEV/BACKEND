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
import { SubscriptionModel } from '../../../models/subsriptionModel'
import { sequelize } from '../../../database/config'
import { ITransacionUpdateRequest } from '../../../interfaces/transaction/transacrtion.request'
import { updateTransactionSchema } from '../../../schemas/transactionSchema'
import moment from 'moment'
import { TransactionModel } from '../../../models/transactionModel'
import { ISubscriptionUpdateRequest } from '../../../interfaces/subscription/subscription.request'

export const updateTransaction = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    updateTransactionSchema,
    req.body
  ) as {
    error: ValidationError
    value: ITransacionUpdateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const transaction = await sequelize.transaction()

  try {
    const transactionResult = await TransactionModel.findOne({
      where: {
        deleted: 0,
        transactionStatus: 'unpaid',
        transactionId: validatedData?.transactionId
      },
      transaction
    })

    if (!transactionResult) {
      await transaction.rollback()
      const message = 'Transaction not found'
      logger.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const currentSubscription = await SubscriptionModel.findOne({
      where: {
        deleted: 0,
        subscriptionCompanyId: transactionResult?.transactionCompanyId
      },
      transaction
    })

    if (!currentSubscription) {
      await transaction.rollback()
      const message = 'Subscription not found'
      logger.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const dateNow = moment()

    const subsriptionPayload = {
      subscriptionBillingPlanId: transactionResult?.transactionBillingPlanId,
      subscriptionPlanName: transactionResult?.transactionBillingPlanName,
      subscriptionPrice: transactionResult?.transactionTotalPrice,
      subscriptionMaxUser: transactionResult?.transactionTotalUser,
      subscriptionMaxOffice: 10,
      subscriptionStatus: 'active',
      subscriptionPlan: transactionResult?.transactionPlanCategory,
      subscriptionStartDate: dateNow.toDate(),
      subscriptionDurationMonth: transactionResult?.transactionDurationMonth,
      subscriptionEndDate: dateNow
        .clone()
        .add(transactionResult?.transactionDurationMonth, 'months')
        .toDate(),
      subscriptionNextBillingDate: dateNow
        .clone()
        .add(transactionResult?.transactionDurationMonth, 'months')
        .toDate()
    } as unknown as ISubscriptionUpdateRequest

    await SubscriptionModel.update(subsriptionPayload, {
      where: {
        deleted: 0,
        subscriptionCompanyId: transactionResult?.transactionCompanyId
      },
      transaction
    })

    transactionResult.transactionStatus = 'paid'
    void transactionResult.save()

    await transaction.commit()
    const response = ResponseData.success({})
    logger.info('Transaction updated successfully')
    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    await transaction.rollback()
    return handleServerError(res, serverError)
  }
}
