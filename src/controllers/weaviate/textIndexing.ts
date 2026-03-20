import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/errorHandler'
import { type IndexManyPayload, TPineconeService } from '../../services/TPineCodeService'

export const indexingTextDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = req.body as IndexManyPayload
  try {
    await new TPineconeService().indexMany(payload)
    // await pineconeService.addDocuments(payload)
    // await PineconeBackupService.saveIndexingBackup(payload, 'json')

    const response = ResponseData.success({
      message: `document(s) indexed to Pinecone successfully.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
