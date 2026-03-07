// import { type Response, type Request } from 'express'
// import { StatusCodes } from 'http-status-codes'
// import { ResponseData } from '../../utilities/response'
// import { handleError } from '../../utilities/errorHandler'
// import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
// import { ScreenerService } from '../../services/ScreenerService'
// import { LivePricePredictionService } from '../../services/llm/LivePricePredictionService'
// import type { ScreenerInstance } from '../../models/screenerModel'
// import redisClient from '../../configs/redis'
// import { SCREENER_LIST_CACHE_PREFIX } from '../../utilities/screenerCache'
// import { AppError } from '../../utilities/errorHandler'
// import { IFindAllScreener } from '../../schemas/ScreenerSchema'

// const CACHE_TTL_SECONDS = 10 * 60 // 10 minutes

// export const findAllScreener = async (
//   req: IAuthenticatedRequest,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const userId = req.jwtPayload?.userId
//     if (userId == null) {
//       throw new AppError('Unauthorized', StatusCodes.UNAUTHORIZED)
//     }

//     const query = req.query as unknown as IFindAllScreener
//     const { page = 1, size = 10, search } = query

//     const cacheKey = `${SCREENER_LIST_CACHE_PREFIX}:${userId}:${page}:${size}:${search ?? ''}`

//     const result = await ScreenerService.findAll({
//       screenerUserId: userId,
//       page,
//       limit: size,
//       search
//     })

//     const itemsWithAnalysis = await Promise.all(
//       result.items.map(async (item: ScreenerInstance) => {
//         let analysis = null
//         try {
//           analysis = await LivePricePredictionService.predict(
//             item.screenerCoinSymbol,
//             item.screenerProfile
//           )
//         } catch {
//           analysis = null
//         }
//         const { dataValues } = item
//         return {
//           ...dataValues,
//           screenerCoinImage: dataValues.screenerCoinImage ?? '',
//           analysis
//         }
//       })
//     )

//     const response = ResponseData.success({
//       data: {
//         items: itemsWithAnalysis,
//         totalItems: result.pagination.total,
//         totalPages: result.pagination.totalPages,
//         currentPage: result.pagination.page
//       }
//     })

//     await redisClient.set(cacheKey, JSON.stringify(response), 'EX', CACHE_TTL_SECONDS)

//     return res.status(StatusCodes.OK).json(response)
//   } catch (error) {
//     return handleError(res, error)
//   }
// }
