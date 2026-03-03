import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/userModel'
import { AppError } from '../utilities/AppError'
import { hashPassword } from '../utilities/scurePassword'
import { IUpdateMyProfile } from '../schemas/MyProfileSchema'

export class MyProfileService {
  static async find(userId: number) {
    const result = await UserModel.findOne({
      where: {
        deleted: 0,
        userId
      },
      attributes: [
        'userId',
        'userName',
        'userRole',
        'userEmail',
        'userOnboardingStatus',
        'createdAt',
        'updatedAt'
      ]
    })

    if (result == null) {
      throw AppError.notFound('User not found!')
    }

    return result
  }

  static async update(userId: number, params: IUpdateMyProfile) {
    const { userName, userPassword, userEmail } = params

    if (userEmail != null && String(userEmail).trim() !== '') {
      const existing = await UserModel.findOne({
        where: {
          deleted: 0,
          userEmail: userEmail.trim()
        }
      })
      if (existing != null && existing.userId !== userId) {
        throw new AppError('Email sudah digunakan!', StatusCodes.CONFLICT)
      }
    }

    const newData: Record<string, unknown> = {}
    if (userName != null && String(userName).trim().length > 0) {
      newData.userName = userName.trim()
    }
    if (userPassword != null && String(userPassword).trim().length > 0) {
      newData.userPassword = hashPassword(userPassword)
    }
    if (userEmail != null && String(userEmail).trim().length > 0) {
      newData.userEmail = userEmail.trim()
    }

    if (Object.keys(newData).length === 0) {
      return
    }

    await UserModel.update(newData, {
      where: {
        deleted: 0,
        userId
      }
    })
  }

  static async updateOnboarding(
    userId: number,
    userOnboardingStatus: 'waiting' | 'completed'
  ) {
    await UserModel.update(
      { userOnboardingStatus },
      {
        where: {
          deleted: 0,
          userId
        }
      }
    )
  }
}
