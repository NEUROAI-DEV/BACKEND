import crypto from 'crypto'
import { Pinecone, type Index } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import { appConfigs } from '../configs'
import { AppError } from '../utilities/errorHandler'
import { StatusCodes } from 'http-status-codes'
import logger from '../utilities/logger'

/** Satu dokumen untuk indexing teks (sama seperti `RagDocument`). */
export type IndexingTextItem = {
  content: string
  source?: string
}

/** Body bisa array langsung atau dibungkus `documents` (sesuai payload client). */
export type IndexManyPayload = IndexingTextItem[] | { documents: IndexingTextItem[] }

type PineconeTextMetadata = {
  content: string
  source: string
}

export class TPineconeService {
  private pinecone: Pinecone
  private indexName: string
  private namespace: string
  private openai: OpenAI

  constructor() {
    const apiKey = appConfigs.pinecone.apiKey ?? ''
    if (!apiKey) {
      throw new AppError(
        'Pinecone is not configured. Missing PINECONE_API_KEY.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }

    this.pinecone = new Pinecone({ apiKey })
    this.indexName = process.env.PINECONE_INDEX_NAME ?? 'neuroai'
    this.namespace = process.env.PINECONE_NAMESPACE ?? '__default__'

    const openAIKey = appConfigs.llm.openAIApiKey
    if (!openAIKey) {
      throw new AppError(
        'OpenAI is not configured. Missing OPENAI_API_KEY.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }

    this.openai = new OpenAI({ apiKey: openAIKey })
  }

  private static normalizeDocuments(payload: IndexManyPayload): IndexingTextItem[] {
    if (Array.isArray(payload)) {
      return payload
    }
    if (payload && typeof payload === 'object' && Array.isArray(payload.documents)) {
      return payload.documents
    }
    throw new AppError(
      'Invalid body: expected an array of documents or { documents: [...] }.',
      StatusCodes.BAD_REQUEST
    )
  }

  private static recordId(source: string, content: string): string {
    return crypto.createHash('sha256').update(`${source}:${content}`).digest('hex')
  }

  private async getIndex(): Promise<Index<PineconeTextMetadata>> {
    try {
      const indexModel = await this.pinecone.describeIndex(this.indexName)
      return this.pinecone.index<PineconeTextMetadata>({ host: indexModel.host })
    } catch {
      const indexList = await this.pinecone.listIndexes()
      const names =
        indexList?.indexes?.map((i) => i.name).filter((n): n is string => Boolean(n)) ??
        []

      if (names.length === 1) {
        this.indexName = names[0]
        const indexModel = await this.pinecone.describeIndex(this.indexName)
        return this.pinecone.index<PineconeTextMetadata>({ host: indexModel.host })
      }

      logger.error(
        `[TPineconeService] Index not found: ${this.indexName}. Available: ${names.join(', ') || '(none)'}`
      )
      throw new AppError(
        `Pinecone index not found: ${this.indexName}. Set PINECONE_INDEX_NAME.`,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  private async createEmbedding(text: string): Promise<number[]> {
    const input = text.trim()
    if (!input) {
      throw new AppError(
        'Each document must have non-empty `content` for embedding.',
        StatusCodes.BAD_REQUEST
      )
    }

    const response = await this.openai.embeddings.create({
      model: process.env.PINECONE_EMBEDDING_MODEL ?? 'text-embedding-3-small',
      input
    })

    const embedding = response.data[0]?.embedding
    if (!embedding) {
      throw new AppError(
        'OpenAI embeddings returned no vector.',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }

    return embedding
  }

  /** Index satu record (field teks: `text`). */
  async indexText(data: {
    id: string
    text: string
    metadata?: Record<string, string>
  }): Promise<void> {
    const embedding = await this.createEmbedding(data.text)
    const index = await this.getIndex()

    await index.upsert({
      namespace: this.namespace,
      records: [
        {
          id: data.id,
          values: embedding,
          metadata: {
            content: data.text,
            source: data.metadata?.source ?? '',
            ...data.metadata
          }
        }
      ]
    })
  }

  /** Bulk index: pakai `content` + `source` (bukan `text`). */
  async indexMany(payload: IndexManyPayload): Promise<void> {
    const items = TPineconeService.normalizeDocuments(payload)
    if (items.length === 0) {
      throw new AppError('No documents to index.', StatusCodes.BAD_REQUEST)
    }

    const index = await this.getIndex()

    const records = await Promise.all(
      items.map(async (item) => {
        const content =
          typeof item.content === 'string' ? item.content : String(item.content ?? '')
        const source = item.source != null ? String(item.source) : ''

        const embedding = await this.createEmbedding(content)
        const id = TPineconeService.recordId(source, content.trim())

        return {
          id,
          values: embedding,
          metadata: {
            content: content.trim(),
            source
          } satisfies PineconeTextMetadata
        }
      })
    )

    logger.info(
      `[TPineconeService] upsert -> index=${this.indexName}, namespace=${this.namespace}, count=${records.length}`
    )

    await index.upsert({
      namespace: this.namespace,
      records
    })
  }
}
