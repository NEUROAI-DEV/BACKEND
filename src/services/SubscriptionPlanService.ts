import { Op } from 'sequelize'
import {
  SubscriptionPlanModel,
  type ISubscriptionPlanAttributes,
  type ISubscriptionPlanCreationAttributes
} from '../models/subscriptionPlanModel'
import { AppError } from '../utilities/errorHandler'
import logger from '../utilities/logger'
import { StatusCodes } from 'http-status-codes'

export class SubscriptionPlanService {
  static async create(
    payload: ISubscriptionPlanCreationAttributes
  ): Promise<ISubscriptionPlanAttributes> {
    try {
      const exists = await SubscriptionPlanModel.findOne({
        where: { subscriptionPlanOrder: payload.subscriptionPlanOrder }
      })

      if (exists != null) {
        throw AppError.badRequest('subscriptionPlanOrder sudah digunakan')
      }

      const created = await SubscriptionPlanModel.create(payload)
      return created.get({ plain: true }) as ISubscriptionPlanAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SubscriptionPlanService] create failed: ${String(error)}`)
      throw new AppError(
        'Failed to create subscription plan',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findAll(params: { page?: number; size?: number }) {
    try {
      const page = params.page && params.page > 0 ? params.page : 1
      const size = params.size && params.size > 0 ? params.size : 10
      const offset = (page - 1) * size

      const { rows, count } = await SubscriptionPlanModel.findAndCountAll({
        where: {
          deleted: {
            [Op.eq]: 0
          }
        },
        order: [['subscriptionPlanOrder', 'ASC']],
        limit: size,
        offset
      })

      return {
        items: rows.map((row) => row.get({ plain: true }) as ISubscriptionPlanAttributes),
        totalItems: count,
        page,
        size,
        totalPages: Math.ceil(count / size)
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SubscriptionPlanService] findAll failed: ${String(error)}`)
      throw new AppError(
        'Failed to find all subscription plans',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findDetail(
    subscriptionPlanId: number
  ): Promise<ISubscriptionPlanAttributes> {
    try {
      const plan = await SubscriptionPlanModel.findOne({
        where: { subscriptionPlanId, deleted: 0 }
      })

      if (plan == null) {
        throw AppError.notFound('Subscription plan tidak ditemukan')
      }

      return plan.get({ plain: true }) as ISubscriptionPlanAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SubscriptionPlanService] findDetail failed: ${String(error)}`)
      throw new AppError(
        'Failed to find subscription plan detail',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async update(
    subscriptionPlanId: number,
    payload: Partial<ISubscriptionPlanCreationAttributes>
  ): Promise<ISubscriptionPlanAttributes> {
    try {
      const plan = await SubscriptionPlanModel.findOne({
        where: { subscriptionPlanId, deleted: 0 }
      })

      if (plan == null) {
        throw AppError.notFound('Subscription plan tidak ditemukan')
      }

      if (
        payload.subscriptionPlanOrder != null &&
        payload.subscriptionPlanOrder !== plan.subscriptionPlanOrder
      ) {
        const exists = await SubscriptionPlanModel.findOne({
          where: {
            subscriptionPlanOrder: payload.subscriptionPlanOrder,
            subscriptionPlanId: {
              [Op.ne]: subscriptionPlanId
            }
          }
        })

        if (exists != null) {
          throw AppError.badRequest('subscriptionPlanOrder sudah digunakan')
        }
      }

      await plan.update(payload)

      return plan.get({ plain: true }) as ISubscriptionPlanAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SubscriptionPlanService] update failed: ${String(error)}`)
      throw new AppError(
        'Failed to update subscription plan',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async remove(subscriptionPlanId: number): Promise<void> {
    try {
      const plan = await SubscriptionPlanModel.findOne({
        where: { subscriptionPlanId, deleted: 0 }
      })

      if (plan == null) {
        throw AppError.notFound('Subscription plan tidak ditemukan')
      }

      await plan.destroy()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SubscriptionPlanService] remove failed: ${String(error)}`)
      throw new AppError(
        'Failed to remove subscription plan',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
