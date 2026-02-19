import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import {
  findAllIndexings,
  type FindAllIndexingsParams
} from '../../services/indexing/IndexingStoreService'
import { findAllIndexingsSchema } from '../../schemas/chatSchema'

export const getAllIndexings = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllIndexingsSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { page, size, source, sourceType, search } = validatedData
  const params: FindAllIndexingsParams = {
    page,
    limit: size,
    source: source || undefined,
    sourceType: sourceType || undefined,
    search: search || undefined
  }

  try {
    const result = await findAllIndexings(params)
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
    return handleServerError(res, serverError)
  }
}
