import { weaviateService } from '../WeaviateService'
import { LLMService } from './LlmServices'
import { AppError } from '../../utilities/errorHandler'
import logger from '../../../logs'
import { StatusCodes } from 'http-status-codes'
import { screenerByCategoryTool } from './tools/ScreenerTools'
import type { ScreenerCategory } from '../ScreenerService'

const RAG_LIMIT = 5

export interface ChatParams {
  message: string
  context?: string
}

export class ChatService {
  private static model = LLMService.create()

  private static detectScreenerCategory(message: string): ScreenerCategory | null {
    const m = message.toLowerCase()

    if (/(trending|trend|tranding)/i.test(m)) return 'trending'
    if (/(gainer|gainers|naik|top naik)/i.test(m)) return 'gainers'
    if (/(loser|losers|looser|turun|top turun)/i.test(m)) return 'losers'
    if (/(market|markets|coin list|daftar coin)/i.test(m)) return 'markets'

    return null
  }

  static async chat(params: ChatParams) {
    try {
      const { message, context } = params

      const systemPrompt =
        'You are a helpful AI assistant specialized in crypto, trading, and general questions. Your neme is Neuoro. Answer clearly, safely, and concisely. Use the provided context when relevant; if context is missing or irrelevant, answer from general knowledge.'

      let ragContext: string | undefined
      try {
        const chunks = await weaviateService.search(message, RAG_LIMIT)
        if (chunks.length > 0) {
          ragContext = chunks
            .map((c) => (c.source ? `[${c.source}]\n${c.content}` : c.content))
            .join('\n\n')
        }
      } catch {
        ragContext = undefined
      }

      let toolContext: string | undefined
      const category = this.detectScreenerCategory(message)
      if (category) {
        try {
          const toolResult = await screenerByCategoryTool.invoke({
            category,
            page: 1,
            size: 5,
            search: ''
          })
          toolContext = `Screener data (${category}, top 5):\n${JSON.stringify(toolResult)}`
        } catch (toolErr) {
          logger.warn(`[ChatService] screener tool failed: ${String(toolErr)}`)
        }
      }

      const combinedContext = [ragContext, toolContext, context]
        .filter(Boolean)
        .join('\n\n')
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[ChatService] chat failed: ${String(error)}`)
      throw new AppError('Failed to chat', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
