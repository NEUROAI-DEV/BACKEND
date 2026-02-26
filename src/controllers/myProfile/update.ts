import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { AppError } from '../../utilities/AppError'
import { IUpdateMyProfile } from '../../schemas/MyProfileSchema'
import { MyProfileService } from '../../services/MyProfileService'

export const updateMyProfile = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { userName, userPassword, userEmail } = req.body as IUpdateMyProfile

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
