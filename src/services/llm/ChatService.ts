import { pineconeService } from '../PineconeService'
import { LLMService } from './LlmServices'
import { AppError } from '../../utilities/errorHandler'
import logger from '../../utilities/logger'
import { StatusCodes } from 'http-status-codes'
import { screenerByCategoryTool } from './tools/ScreenerTools'
import type { ScreenerCategory } from '../ScreenerService'
import { dailySummaryTodayTool } from './tools/DailySummaryTools'
import type { DailySummaryToolResult } from './tools/DailySummaryTools'
import { trendingNewsTool } from './tools/NewsTools'

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

  private static detectDailySummaryIntent(message: string): boolean {
    const m = message.toLowerCase()
    return (
      /(daily summary|ringkasan harian|summary hari ini)/i.test(m) ||
      /(market sentiment|sentimen pasar)/i.test(m)
    )
  }

  private static detectTrendingNewsIntent(message: string): boolean {
    const m = message.toLowerCase()
    return (
      /(berita|news).*(trending|trend|tranding)/i.test(m) ||
      /(trending|trend|tranding).*(berita|news)/i.test(m)
    )
  }

  static async chat(params: ChatParams) {
    try {
      const { message, context } = params

      const systemPrompt =
        'You are a helpful AI assistant specialized in crypto, trading, and general questions. Your neme is Neuoro. Answer clearly, safely, and concisely. Use the provided context when relevant; if context is missing or irrelevant, answer from general knowledge.'

      let ragContext: string | undefined
      try {
        const chunks = await pineconeService.search(message, RAG_LIMIT)
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

      if (this.detectTrendingNewsIntent(message)) {
        try {
          const newsResult = await trendingNewsTool.invoke({
            page: 1,
            size: 5,
            search: ''
          })
          toolContext = [
            toolContext,
            `Trending news (top 5):\n${JSON.stringify(newsResult)}`
          ]
            .filter(Boolean)
            .join('\n\n')
        } catch (toolErr) {
          logger.warn(`[ChatService] trending news tool failed: ${String(toolErr)}`)
        }
      }

      const wantsDailySummary = this.detectDailySummaryIntent(message)
      if (wantsDailySummary) {
        // For daily summary requests, return data deterministically
        // to avoid LLM "guessing" missing context.
        try {
          const dailyResult = (await dailySummaryTodayTool.invoke(
            {}
          )) as DailySummaryToolResult
          if (!dailyResult?.exists) {
            return { reply: 'daily summary belum tersedia untuk hari ini' }
          }

          const reply = [
            `Daily Summary (Asia/Jakarta) - ${dailyResult.dailySummaryDate}`,
            `Market Sentiment: ${dailyResult.dailySummaryMarketSentiment}`,
            `Confidence: ${dailyResult.dailySummaryConfidence}`,
            `Summary: ${dailyResult.dailySummarySummary}`,
            `Highlights:`,
            dailyResult.dailySummaryHighlights.map((h) => `- ${h}`).join('\n')
          ].join('\n')

          return { reply }
        } catch (dailyErr) {
          logger.warn(`[ChatService] daily summary tool failed: ${String(dailyErr)}`)
          return { reply: 'daily summary belum tersedia untuk hari ini' }
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
