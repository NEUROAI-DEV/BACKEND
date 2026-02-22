import weaviate, { type WeaviateClient, Filters } from 'weaviate-client'
import { appConfigs } from '../configs'

const COLLECTION_NAME = appConfigs.weaviate.collectionName
const DEFAULT_SEARCH_LIMIT = 5

let clientInstance: WeaviateClient | null = null

function parseWeaviateUrl(url: string): { host: string; port: number } {
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

async function getClient(): Promise<WeaviateClient> {
  if (clientInstance) return clientInstance

  const { url, apiKey } = appConfigs.weaviate
  const openAIApiKey = appConfigs.llm.openAIApiKey ?? ''
  const headers: Record<string, string> = {}
  if (openAIApiKey) headers['X-OpenAI-Api-Key'] = openAIApiKey

  if (apiKey) {
    clientInstance = await weaviate.connectToWeaviateCloud(url, {
      authCredentials: new weaviate.ApiKey(apiKey),
      headers: Object.keys(headers).length ? headers : undefined
    })
  } else {
    const { host, port } = parseWeaviateUrl(url)
    clientInstance = await weaviate.connectToLocal({
      host,
      port,
      headers: Object.keys(headers).length ? headers : undefined
    })
  }

  return clientInstance
}

async function ensureCollection(): Promise<void> {
  const client = await getClient()
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

export type RagDocument = { content: string; source?: string }

export async function addDocuments(documents: RagDocument[]): Promise<void> {
  if (documents.length === 0) return
  const client = await getClient()
  await ensureCollection()
  const collection = client.collections.use(COLLECTION_NAME)
  const objects = documents.map((d) => ({
    content: d.content,
    source: d.source ?? ''
  }))
  await collection.data.insertMany(objects)
}

export async function search(
  query: string,
  limit: number = DEFAULT_SEARCH_LIMIT
): Promise<Array<{ content: string; source?: string }>> {
  const client = await getClient()
  await ensureCollection()
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

/**
 * Hapus dokumen di Weaviate yang cocok dengan content dan source (untuk sinkron dengan DB).
 */
export async function deleteByContentAndSource(
  content: string,
  source: string
): Promise<{ deleted: number }> {
  const client = await getClient()
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

export async function closeWeaviate(): Promise<void> {
  if (clientInstance) {
    await clientInstance.close()
    clientInstance = null
  }
}
