import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/errorHandler'
import { PineconeService, RagDocument } from '../../services/PineconeService'
import { PineconeBackupService } from '../../services/PineconeBackupService'

export const indexingTextDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = req.body as { documents: RagDocument[] }
  try {
    await new PineconeService().addDocuments(payload.documents)
    await PineconeBackupService.saveIndexingBackup(payload.documents, 'json')

    const response = ResponseData.success({
      message: `document(s) indexed to Pinecone successfully.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
