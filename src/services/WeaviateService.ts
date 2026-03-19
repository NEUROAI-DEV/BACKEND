import fs from 'fs'
import weaviate, { type WeaviateClient, Filters } from 'weaviate-client'
import { appConfigs } from '../configs'
import { chunkText } from '../utilities/textChunking'
import { WeaviateBackupService } from './WeaviateBackupService'
import { AppError } from '../utilities/errorHandler'
import logger from '../../logs'
import { StatusCodes } from 'http-status-codes'

export type RagDocument = { content: string; source?: string }

export type IndexPdfResult = { indexed: number; source: string }

const COLLECTION_NAME = appConfigs.weaviate.collectionName
const DEFAULT_SEARCH_LIMIT = 5

class WeaviateService {
  private client: WeaviateClient | null = null

  private parseWeaviateUrl(url: string): { host: string; port: number } {
    try {
      const u = new URL(url)
      return {
        host: u.hostname,
        port: u.port ? parseInt(u.port, 10) : 8080
      }
    } catch {
      return { host: 'localhost', port: 8080 }
    }
  }

  private async getClient(): Promise<WeaviateClient> {
    if (this.client) return this.client

    const { url, apiKey } = appConfigs.weaviate
    const openAIApiKey = appConfigs.llm.openAIApiKey ?? ''

    const headers: Record<string, string> = {}
    if (openAIApiKey) {
      headers['X-OpenAI-Api-Key'] = openAIApiKey
    }

    if (apiKey) {
      this.client = await weaviate.connectToWeaviateCloud(url, {
        authCredentials: new weaviate.ApiKey(apiKey),
        headers: Object.keys(headers).length ? headers : undefined
      })
    } else {
      const { host, port } = this.parseWeaviateUrl(url)
      this.client = await weaviate.connectToLocal({
        host,
        port,
        headers: Object.keys(headers).length ? headers : undefined
      })
    }

    return this.client
  }

  private async ensureCollection(): Promise<void> {
    const client = await this.getClient()
    const exists = await client.collections.exists(COLLECTION_NAME)
    if (exists) return

    await client.collections.create({
      name: COLLECTION_NAME,
      properties: [
        { name: 'content', dataType: 'text' as const },
        { name: 'source', dataType: 'text' as const }
      ],
      vectorizers: weaviate.configure.vectors.text2VecOpenAI({
        sourceProperties: ['content']
      })
    })
  }

  async addDocuments(documents: RagDocument[]): Promise<void> {
    try {
      if (documents.length === 0) return

      const client = await this.getClient()
      await this.ensureCollection()

      const collection = client.collections.use(COLLECTION_NAME)
      const objects = documents.map((d) => ({
        content: d.content,
        source: d.source ?? ''
      }))

      await collection.data.insertMany(objects)
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[WeaviateService] addDocuments failed: ${String(error)}`)
      throw new AppError('Failed to add documents', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  async search(
    query: string,
    limit: number = DEFAULT_SEARCH_LIMIT
  ): Promise<Array<{ content: string; source?: string }>> {
    try {
      const client = await this.getClient()
      await this.ensureCollection()

      const collection = client.collections.use(COLLECTION_NAME)
      const result = await collection.query.nearText(query, { limit })

      return result.objects.map((obj) => {
        const props = obj.properties as { content?: string; source?: string }
        return {
          content: typeof props.content === 'string' ? props.content : '',
          source: typeof props.source === 'string' ? props.source : undefined
        }
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[WeaviateService] search failed: ${String(error)}`)
      throw new AppError('Failed to search', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteByContentAndSource(
    content: string,
    source: string
  ): Promise<{ deleted: number }> {
    try {
      const client = await this.getClient()
      const exists = await client.collections.exists(COLLECTION_NAME)
      if (!exists) return { deleted: 0 }

      const collection = client.collections.use(COLLECTION_NAME)
      const where = Filters.and(
        collection.filter.byProperty('content').equal(content),
        collection.filter.byProperty('source').equal(source)
      )

      const result = await collection.data.deleteMany(where)
      const deleted = result?.successful ?? 0

      return { deleted }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[WeaviateService] deleteByContentAndSource failed: ${String(error)}`)
      throw new AppError(
        'Failed to delete by content and source',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }

  private static async extractTextFromPdf(filePath: string): Promise<string> {
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

  async indexPdfFromFile(filePath: string, source: string): Promise<IndexPdfResult> {
    try {
      const text = await WeaviateService.extractTextFromPdf(filePath)
      if (!text.trim()) {
        throw new Error('No text could be extracted from the PDF.')
      }

      const chunks = chunkText(text, 600, 80)
      if (chunks.length === 0) {
        throw new Error('No content chunks to index from the PDF.')
      }

      const payload = chunks.map((content) => ({ content, source }))
      await this.addDocuments(payload)
      await WeaviateBackupService.saveIndexingBackup(payload, 'pdf')

      return { indexed: chunks.length, source }
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[WeaviateService] indexPdfFromFile failed: ${String(error)}`)
      throw new AppError(
        'Failed to index pdf from file',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export const weaviateService = new WeaviateService()
export { WeaviateService }
