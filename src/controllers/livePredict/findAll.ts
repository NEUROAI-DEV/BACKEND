import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { LivePredictService } from '../../services/LivePredictService'
import type { IFindAllLivePredict } from '../../schemas/LivePredictSchema'

export const findAllLivePredict = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllLivePredict
    const result = await LivePredictService.findAll({
      page: query.page,
      size: query.size,
      livePredictUserId: query.livePredictUserId
    })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.totalItems,
        page: result.page,
        size: result.size,
        totalPages: result.totalPages
      }
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
