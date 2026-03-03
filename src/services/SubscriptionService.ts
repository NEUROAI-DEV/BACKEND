import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/userModel'
import { AppError } from '../utilities/AppError'

export class SubscriptionService {
  static async startFreeTrial(userId: number) {
    const user = await UserModel.findOne({
      where: {
        userId,
        deleted: 0
      }
    })

    if (user == null) {
      throw AppError.notFound('User tidak ditemukan')
    }

    const now = new Date()

    if (user.userSubscriptionStatus === 'active') {
      throw new AppError('Anda sudah memiliki langganan aktif', StatusCodes.BAD_REQUEST)
    }

    if (
      user.userSubscriptionPlan === 'free' &&
      user.userSubscriptionStatus !== 'inactive'
    ) {
      throw new AppError('Free trial sudah pernah digunakan', StatusCodes.BAD_REQUEST)
    }

    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 30)

    await user.update({
      userSubscriptionPlan: 'free',
      userSubscriptionStatus: 'active',
      userSubscriptionStartDate: now,
      userSubscriptionEndDate: endDate
    })

    return user
  }

  static async subscribeMonthly(userId: number) {
    const user = await UserModel.findOne({
      where: {
        userId,
        deleted: 0
      }
    })

    if (user == null) {
      throw AppError.notFound('User tidak ditemukan')
    }

    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 30)

    await user.update({
      userSubscriptionPlan: 'pro',
      userSubscriptionStatus: 'active',
      userSubscriptionStartDate: now,
      userSubscriptionEndDate: endDate
    })

    return user
  }
}
