import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { addDocuments } from '../../services/weaviate/WeaviateRagService'
import { saveIndexingBackup } from '../../services/indexing/IndexingStoreService'
import { indexChatRequestSchema } from '../../schemas/chatSchema'

export const indexChatDocuments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    indexChatRequestSchema,
    req.body
  )

  if (validationError) return handleValidationError(res, validationError)

  const { documents } = validatedData
  const payload = documents.map((d: { content: string; source?: string }) => ({
    content: d.content,
    source: d.source ?? undefined
  }))

  try {
    await addDocuments(payload)
    await saveIndexingBackup(payload, 'json')

    const response = ResponseData.success({
      data: { indexed: documents.length },
      message: `${documents.length} document(s) indexed to Weaviate successfully.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
