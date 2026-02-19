import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type UpdateOnboardingInput } from '../../schemas/myProfileSchema'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { MyProfileService } from '../../services/myProfile'
import { AppError } from '../../errors/AppError'

export const updateOnboardingStatus = async (
  req: Request<{}, {}, UpdateOnboardingInput> & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { userOnboardingStatus } = req.body

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
