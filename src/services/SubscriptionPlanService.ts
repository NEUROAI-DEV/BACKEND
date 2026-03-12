import { Op } from 'sequelize'
import {
  SubscriptionPlanModel,
  type ISubscriptionPlanAttributes,
  type ISubscriptionPlanCreationAttributes
} from '../models/subscriptionPlanModel'
import { AppError } from '../utilities/errorHandler'

export class SubscriptionPlanService {
  static async create(
    payload: ISubscriptionPlanCreationAttributes
  ): Promise<ISubscriptionPlanAttributes> {
    const exists = await SubscriptionPlanModel.findOne({
      where: { subscriptionPlanOrder: payload.subscriptionPlanOrder }
    })

    if (exists != null) {
      throw AppError.badRequest('subscriptionPlanOrder sudah digunakan')
    }

    const created = await SubscriptionPlanModel.create(payload)
    return created.get({ plain: true }) as ISubscriptionPlanAttributes
  }

  static async findAll(params: { page?: number; size?: number }) {
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
  }

  static async findDetail(
    subscriptionPlanId: number
  ): Promise<ISubscriptionPlanAttributes> {
    const plan = await SubscriptionPlanModel.findOne({
      where: { subscriptionPlanId, deleted: 0 }
    })

    if (plan == null) {
      throw AppError.notFound('Subscription plan tidak ditemukan')
    }

    return plan.get({ plain: true }) as ISubscriptionPlanAttributes
  }

  static async update(
    subscriptionPlanId: number,
    payload: Partial<ISubscriptionPlanCreationAttributes>
  ): Promise<ISubscriptionPlanAttributes> {
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
  }

  static async remove(subscriptionPlanId: number): Promise<void> {
    const plan = await SubscriptionPlanModel.findOne({
      where: { subscriptionPlanId, deleted: 0 }
    })

    if (plan == null) {
      throw AppError.notFound('Subscription plan tidak ditemukan')
    }

    await plan.destroy()
  }
}
