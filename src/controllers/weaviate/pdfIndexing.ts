import { type Request, type Response } from 'express'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { weaviateService } from '../../services/WeaviateService'

export const indexingPdfDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.file) {
    const response = ResponseData.error({
      message:
        'No file uploaded. Send a PDF using multipart/form-data with field name "file".'
    })
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  const filePath = req.file.path
  const source = (req.body?.source as string)?.trim() || req.file.originalname || 'pdf'

  try {
    const result = await weaviateService.indexPdfFromFile(filePath, source)

    const response = ResponseData.success({
      data: { indexed: result.indexed, source: result.source },
      message: `PDF indexed successfully. ${result.indexed} chunk(s) added to Weaviate.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (err) {
    return handleError(res, err)
  } finally {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {
      // ignore cleanup errors
    }
  }
}
