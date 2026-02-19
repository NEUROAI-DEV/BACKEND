import { type Request, type Response } from 'express'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { addDocuments } from '../../services/weaviate/WeaviateRagService'
import { saveIndexingBackup } from '../../services/indexing/IndexingStoreService'
import { chunkText } from '../../utilities/textChunking'

async function extractTextFromPdf(filePath: string): Promise<string> {
  const mod = await import('pdf-parse')
  const PDFParse = mod.PDFParse ?? mod.default
  const buffer = fs.readFileSync(filePath)
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    const result = await parser.getText()
    return result?.text ?? ''
  } finally {
    await parser.destroy()
  }
}

export const indexChatDocumentsFromPdf = async (
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
    const text = await extractTextFromPdf(filePath)
    if (!text.trim()) {
      const response = ResponseData.error({
        message: 'No text could be extracted from the PDF.'
      })
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }

    const chunks = chunkText(text, 600, 80)
    if (chunks.length === 0) {
      const response = ResponseData.error({
        message: 'No content chunks to index from the PDF.'
      })
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }

    const payload = chunks.map((content) => ({ content, source }))
    await addDocuments(payload)
    await saveIndexingBackup(payload, 'pdf')

    const response = ResponseData.success({
      data: { indexed: chunks.length, source },
      message: `PDF indexed successfully. ${chunks.length} chunk(s) added to Weaviate.`
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  } finally {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch {
      // ignore cleanup errors
    }
  }
}
