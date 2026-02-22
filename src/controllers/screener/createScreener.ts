import { type Response, type Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type CreateScreenerInput } from '../../schemas/ScreenerSchema'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { ScreenerService } from '../../services/ScreenerService'
import { AppError } from '../../errors/AppError'
import { invalidateScreenerCacheForUser } from '../../utilities/screenerCache'

export const createScreener = async (
  req: Request<{}, {}, CreateScreenerInput> & IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.jwtPayload?.userId
    if (userId == null) {
      throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
    }

    const { screenerCoinSymbol, screenerProfile, screenerCoinImage } = req.body

    const record = await ScreenerService.create({
      screenerUserId: userId,
      screenerCoinSymbol,
      screenerProfile,
      screenerCoinImage: screenerCoinImage ?? ''
    })

    await invalidateScreenerCacheForUser(userId)

    return res.status(StatusCodes.CREATED).json(
      ResponseData.success({
        data: record,
        message: 'Screener created successfully'
      })
    )
  } catch (error) {
    return handleError(res, error)
  }
}
