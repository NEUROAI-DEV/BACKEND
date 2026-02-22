import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { deleteIndexingById } from '../../services/IndexingStoreService'
import { deleteIndexingParamsSchema } from '../../schemas/ChatSchema'

export const removeIndexingById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    deleteIndexingParamsSchema,
    req.params
  )

  if (validationError) return handleValidationError(res, validationError)

  const id = parseInt((validatedData as { id: string }).id, 10)

  try {
    const deleted = await deleteIndexingById(id)
    if (!deleted) {
      const response = ResponseData.error({
        message: 'Indexing not found.'
      })
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }
    const response = ResponseData.success({
      data: { id },
      message: 'Indexing deleted from database and Weaviate.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
