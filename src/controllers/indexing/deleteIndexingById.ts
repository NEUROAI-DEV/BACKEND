import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { WeaviateBackupService } from '../../services/WeaviateBackupService'
import { IDeleteIndexingParams } from '../../schemas/ChatSchema'

export const removeIndexingById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const params = req.params as unknown as IDeleteIndexingParams

  try {
    const deleted = await WeaviateBackupService.deleteIndexingById(
      parseInt(params.id, 10)
    )

    if (!deleted) {
      const response = ResponseData.error({
        message: 'Indexing not found.'
      })
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const response = ResponseData.success({
      data: { id: params.id },
      message: 'Indexing deleted from database and Weaviate.'
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
