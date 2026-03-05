import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { weaviateService } from '../../services/WeaviateService'
import {
  type IndexingDocument,
  WeaviateBackupService
} from '../../services/WeaviateBackupService'

export const indexingTextDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = req.body as IndexingDocument[]
  try {
    await weaviateService.addDocuments(payload)
    await WeaviateBackupService.saveIndexingBackup(payload, 'json')

    const response = ResponseData.success({
      message: `document(s) indexed to Weaviate successfully.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
