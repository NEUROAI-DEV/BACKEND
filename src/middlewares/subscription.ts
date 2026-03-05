import { type NextFunction, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { type IAuthenticatedRequest } from '../interfaces/shared/request.interface'
import { UserModel } from '../models/userModel'
import { ResponseData } from '../utilities/response'
import { handleServerError } from '../utilities/errorHandler'

export const requireActiveSubscription = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.jwtPayload?.userId

    if (userId == null) {
      const response = ResponseData.error({ message: 'Tidak terotorisasi' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const user = await UserModel.findOne({
      where: {
        userId,
        deleted: 0
      }
    })

    if (user == null) {
      const response = ResponseData.error({ message: 'User tidak ditemukan' })
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const now = new Date()

    if (
      user.userSubscriptionStatus === 'active' &&
      user.userSubscriptionEndDate != null &&
      user.userSubscriptionEndDate < now
    ) {
      await user.update({ userSubscriptionStatus: 'expired' })
    }

    const isActive =
      user.userSubscriptionStatus === 'active' &&
      (user.userSubscriptionEndDate == null || user.userSubscriptionEndDate >= now)

    if (!isActive) {
      const response = ResponseData.error({
        message:
          'Fitur ini memerlukan langganan aktif. Aktifkan free trial atau langganan bulanan terlebih dahulu.'
      })
      return res.status(StatusCodes.FORBIDDEN).json(response)
    }

    return next()
  } catch (error) {
    return handleServerError(res, error)
  }
}
