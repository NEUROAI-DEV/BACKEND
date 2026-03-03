import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import {
  WeaviateBackupService,
  type FindAllIndexingsParams
} from '../../services/WeaviateBackupService'

export const findAllIndexings = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const params = req.query as unknown as FindAllIndexingsParams
  try {
    const result = await WeaviateBackupService.findAllIndexings(params)
    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.pagination.total,
        currentPage: result.pagination.page,
        totalPages: result.pagination.totalPages
      }
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
