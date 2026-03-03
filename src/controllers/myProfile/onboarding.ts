import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { AppError } from '../../utilities/AppError'
import { IUpdateOnboarding } from '../../schemas/MyProfileSchema'
import { MyProfileService } from '../../services/MyProfileService'

export const updateOnboardingStatus = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { userOnboardingStatus } = req.body as IUpdateOnboarding

    await MyProfileService.updateOnboarding(userId, userOnboardingStatus)

    return res.status(StatusCodes.OK).json(
      ResponseData.success({
        message: 'Onboarding status updated successfully'
      })
    )
  } catch (error) {
    return handleError(res, error)
  }
}
