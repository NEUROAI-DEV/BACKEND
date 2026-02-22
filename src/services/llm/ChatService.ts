import { search as ragSearch } from '../WeaviateRagService'
import { LLMService } from './LlmServices'

const RAG_LIMIT = 5

export interface ChatParams {
  message: string
  context?: string
}

export class ChatService {
  private static model = LLMService.create()

  static async chat(params: ChatParams) {
    const { message, context } = params

    const systemPrompt =
      'You are a helpful AI assistant specialized in crypto, trading, and general questions. Answer clearly, safely, and concisely. Use the provided context when relevant; if context is missing or irrelevant, answer from general knowledge.'

    let ragContext: string | undefined
    try {
      const chunks = await ragSearch(message, RAG_LIMIT)
      if (chunks.length > 0) {
        ragContext = chunks
          .map((c) => (c.source ? `[${c.source}]\n${c.content}` : c.content))
          .join('\n\n')
      }
    } catch {
      ragContext = undefined
    }

    const combinedContext = [ragContext, context].filter(Boolean).join('\n\n')
    const userContent = combinedContext
      ? `Context:\n${combinedContext}\n\nUser message:\n${message}`
      : message

    const llmResponse: any = await this.model.invoke([
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userContent
      }
    ])

    let reply: string

    if (Array.isArray(llmResponse?.content)) {
      reply = llmResponse.content
        .map((chunk: any) => {
          if (typeof chunk === 'string') return chunk
          if (typeof chunk?.text === 'string') return chunk.text
          return ''
        })
        .join('')
        .trim()
    } else {
      reply = String(llmResponse?.content ?? '').trim()
    }

    return { reply }
  }
}
