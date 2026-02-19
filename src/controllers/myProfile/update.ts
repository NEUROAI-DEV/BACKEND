import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type UpdateMyProfileInput } from '../../schemas/myProfileSchema'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { MyProfileService } from '../../services/myProfile'
import { AppError } from '../../errors/AppError'

export const updateMyProfile = async (
  req: Request<{}, {}, UpdateMyProfileInput> & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { userName, userPassword, userEmail } = req.body

    const params = {
      ...(userName != null && userName !== '' && { userName }),
      ...(userPassword != null && userPassword !== '' && { userPassword }),
      ...(userEmail != null && userEmail !== '' && { userEmail })
    }

    await MyProfileService.update(userId, params)

    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Profile updated successfully' }))
  } catch (error) {
    return handleError(res, error)
  }
}
