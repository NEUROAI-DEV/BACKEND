import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { SubscriptionService } from '../../services/SubscriptionService'

export const startFreeTrial = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId

    if (userId == null) {
      const response = ResponseData.error({ message: 'Tidak terotorisasi' })
      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    const user = await SubscriptionService.startFreeTrial(userId)

    return res.status(StatusCodes.OK).json(
      ResponseData.success({
        data: {
          userSubscriptionStatus: user.userSubscriptionStatus,
          userSubscriptionPlan: user.userSubscriptionPlan,
          userSubscriptionStartDate: user.userSubscriptionStartDate,
          userSubscriptionEndDate: user.userSubscriptionEndDate
        },
        message: 'Free trial 30 hari berhasil diaktifkan'
      })
    )
  } catch (error) {
    return handleError(res, error)
  }
}
