import weaviate, { type WeaviateClient, Filters } from 'weaviate-client'
import { appConfigs } from '../configs'

export type RagDocument = { content: string; source?: string }

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
    if (documents.length === 0) return

    const client = await this.getClient()
    await this.ensureCollection()

    const collection = client.collections.use(COLLECTION_NAME)
    const objects = documents.map((d) => ({
      content: d.content,
      source: d.source ?? ''
    }))

    await collection.data.insertMany(objects)
  }

  async search(
    query: string,
    limit: number = DEFAULT_SEARCH_LIMIT
  ): Promise<Array<{ content: string; source?: string }>> {
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
  }

  async deleteByContentAndSource(
    content: string,
    source: string
  ): Promise<{ deleted: number }> {
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
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }
}

export const weaviateService = new WeaviateService()
export { WeaviateService }
