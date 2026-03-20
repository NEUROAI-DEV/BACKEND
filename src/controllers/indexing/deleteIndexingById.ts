import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { IDeleteIndexingParams } from '../../schemas/ChatSchema'
import { PineconeBackupService } from '../../services/PineconeBackupService'

export const removeIndexingById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const params = req.params as unknown as IDeleteIndexingParams

  try {
    await PineconeBackupService.deleteIndexingById(parseInt(params.id, 10))

    return res
      .status(StatusCodes.OK)
      .json(
        ResponseData.success({ message: 'Indexing deleted from database and Weaviate.' })
      )
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
