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
import { StatusCodes } from 'http-status-codes'
import logger from '../../logs'

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
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[TransactionService] create failed: ${String(error)}`)
      throw new AppError(
        'Failed to create transaction',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findAll(params: IFindAllTransaction) {
    try {
      const {
        page = 1,
        size = 10,
        transactionUserId,
        transactionStatus,
        pagination,
        search
      } = params
      const paginationInfo = new Pagination(page, size)

      const where: any = { deleted: 0 }

      if (transactionUserId != null) {
        where.transactionUserId = transactionUserId
      }

      if (transactionStatus != null) {
        where.transactionStatus = transactionStatus
      }

      if (search != null && String(search).trim() !== '') {
        const term = `%${String(search).trim()}%`
        where[Op.or] = [
          { transactionAmount: { [Op.like]: term } },
          { transactionStatus: { [Op.like]: term } }
        ]
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[TransactionService] findAll failed: ${String(error)}`)
      throw new AppError(
        'Failed to find all transactions',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findDetail(transactionId: number): Promise<ITransactionAttributes> {
    try {
      const trx = await TransactionModel.findOne({
        where: { transactionId, deleted: 0 }
      })

      if (trx == null) {
        throw AppError.notFound('Transaction tidak ditemukan')
      }

      return trx.get({ plain: true }) as ITransactionAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[TransactionService] findDetail failed: ${String(error)}`)
      throw new AppError(
        'Failed to find transaction detail',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async update(
    transactionId: number,
    payload: Partial<ITransactionCreationAttributes>
  ): Promise<ITransactionAttributes> {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[TransactionService] update failed: ${String(error)}`)
      throw new AppError(
        'Failed to update transaction',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async remove(transactionId: number): Promise<void> {
    try {
      const transaction = await TransactionModel.findOne({
        where: { transactionId, deleted: 0 }
      })

      if (transaction == null) {
        throw AppError.notFound('Transaction tidak ditemukan')
      }

      transaction.deleted = true
      await transaction.save()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[TransactionService] remove failed: ${String(error)}`)
      throw new AppError(
        'Failed to remove transaction',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
