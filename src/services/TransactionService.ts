import { Op } from 'sequelize'
import {
  TransactionModel,
  type ITransactionAttributes,
  type ITransactionCreationAttributes
} from '../models/transactionModel'
import { AppError } from '../utilities/errorHandler'
import { SubscriptionPlanModel } from '../models/subscriptionPlanModel'
import { SubscriptionModel } from '../models/subscriptionModel'
import { Pagination } from '../utilities/pagination'
import { IFindAllTransaction } from '../schemas/TransactionSchema'
import { UserModel } from '../models/userModel'

interface ICreateTransactionPayload {
  transactionSubscriptionPlanId: number
  transactionUserId: number
  transactionProvider?: string
  transactionExternalId?: string
}

export class TransactionService {
  static async create(
    payload: ICreateTransactionPayload
  ): Promise<ITransactionAttributes> {
    const subscriptionPlan = await SubscriptionPlanModel.findOne({
      where: { subscriptionPlanId: payload.transactionSubscriptionPlanId }
    })

    if (subscriptionPlan == null) {
      throw AppError.notFound('Subscription plan not found')
    }

    const transactionPayload: ITransactionCreationAttributes = {
      transactionUserId: payload.transactionUserId,
      transactionSubscriptionSnapshot: subscriptionPlan,
      transactionAmount: subscriptionPlan.subscriptionPlanPriceMonthly,
      transactionStatus: 'PENDING',
      transactionProvider: payload.transactionProvider,
      transactionExternalId: payload.transactionExternalId
    }

    const created = await TransactionModel.create(transactionPayload)
    return created.get({ plain: true }) as ITransactionAttributes
  }

  static async findAll(params: IFindAllTransaction) {
    const {
      page = 1,
      size = 10,
      transactionUserId,
      transactionStatus,
      pagination
    } = params
    const paginationInfo = new Pagination(page, size)

    const where: any = { deleted: 0 }

    if (transactionUserId != null) {
      where.transactionUserId = transactionUserId
    }

    if (transactionStatus != null) {
      where.transactionStatus = transactionStatus
    }

    const result = await TransactionModel.findAndCountAll({
      where,
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['userId', 'userName']
        }
      ],
      order: [['transactionId', 'DESC']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    return paginationInfo.formatData(result)
  }

  static async findDetail(transactionId: number): Promise<ITransactionAttributes> {
    const trx = await TransactionModel.findOne({
      where: { transactionId, deleted: 0 }
    })

    if (trx == null) {
      throw AppError.notFound('Transaction tidak ditemukan')
    }

    return trx.get({ plain: true }) as ITransactionAttributes
  }

  static async update(
    transactionId: number,
    payload: Partial<ITransactionCreationAttributes>
  ): Promise<ITransactionAttributes> {
    const transaction = await TransactionModel.findOne({
      where: { transactionId, deleted: 0, transactionStatus: 'PENDING' }
    })

    if (transaction == null) {
      throw AppError.notFound('Transaction not found or already paid')
    }

    if (payload.transactionStatus === 'PAID') {
      payload.transactionPaidAt = new Date()
      await SubscriptionModel.update(
        {
          subscriptionUserId: transaction.transactionUserId,
          subscriptionSubscriptionPlanId:
            transaction.transactionSubscriptionSnapshot.subscriptionPlanId,
          subscriptionStatus: 'ACTIVE',
          subscriptionStartDate: new Date(),
          subscriptionEndDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
        },
        { where: { subscriptionUserId: transaction.transactionUserId } }
      )
    }

    if (payload.transactionStatus === 'FAILED') {
      transaction.transactionStatus = 'FAILED'
    }

    await transaction.update(payload)

    return transaction.get({ plain: true }) as ITransactionAttributes
  }

  static async remove(transactionId: number): Promise<void> {
    const transaction = await TransactionModel.findOne({
      where: { transactionId, deleted: 0 }
    })

    if (transaction == null) {
      throw AppError.notFound('Transaction tidak ditemukan')
    }

    transaction.deleted = true
    await transaction.save()
  }
}
