import { pineconeService } from '../PineconeService'
import { LLMService } from './LlmServices'
import { AppError } from '../../utilities/errorHandler'
import logger from '../../utilities/logger'
import { StatusCodes } from 'http-status-codes'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
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
  private static readonly RAG_TIMEOUT_MS = 5000
  private static readonly TOOL_TIMEOUT_MS = 5000
  private static readonly LLM_TIMEOUT_MS = 20000

  private static readonly answerPrompt = PromptTemplate.fromTemplate(
    `You are a helpful AI assistant specialized in crypto, trading, and general questions.
Your name is Neuro.

Instructions:
- Answer clearly, safely, and concisely.
- Prioritize provided context when it is relevant.
- If context is empty or not relevant, answer from general knowledge.

Context:
{context}

User message:
{message}`
  )

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

  private static async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string
  ): Promise<T> {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      })
    ])
  }

  private static async buildRagContext(message: string): Promise<string | undefined> {
    try {
      const chunks = await this.withTimeout(
        pineconeService.search(message, RAG_LIMIT),
        this.RAG_TIMEOUT_MS,
        'RAG timeout'
      )

      if (!Array.isArray(chunks) || chunks.length === 0) {
        return undefined
      }

      return chunks
        .map((c) => (c.source ? `[${c.source}]\n${c.content}` : c.content))
        .join('\n\n')
    } catch (error) {
      logger.warn(`[ChatService] RAG retrieval failed: ${String(error)}`)
      return undefined
    }
  }

  private static async buildToolContext(message: string): Promise<string | undefined> {
    const contexts: string[] = []

    const category = this.detectScreenerCategory(message)
    if (category) {
      try {
        const toolResult = await this.withTimeout(
          screenerByCategoryTool.invoke({
            category,
            page: 1,
            size: 5,
            search: ''
          }),
          this.TOOL_TIMEOUT_MS,
          'Screener tool timeout'
        )
        contexts.push(
          `Screener data (${category}, top 5):\n${JSON.stringify(toolResult)}`
        )
      } catch (toolErr) {
        logger.warn(`[ChatService] screener tool failed: ${String(toolErr)}`)
      }
    }

    if (this.detectTrendingNewsIntent(message)) {
      try {
        const newsResult = await this.withTimeout(
          trendingNewsTool.invoke({
            page: 1,
            size: 5,
            search: ''
          }),
          this.TOOL_TIMEOUT_MS,
          'Trending news tool timeout'
        )
        contexts.push(`Trending news (top 5):\n${JSON.stringify(newsResult)}`)
      } catch (toolErr) {
        logger.warn(`[ChatService] trending news tool failed: ${String(toolErr)}`)
      }
    }

    return contexts.length > 0 ? contexts.join('\n\n') : undefined
  }

  static async chat(params: ChatParams) {
    try {
      const { message, context } = params

      const wantsDailySummary = this.detectDailySummaryIntent(message)
      if (wantsDailySummary) {
        try {
          const dailyResult = (await this.withTimeout(
            dailySummaryTodayTool.invoke({}),
            this.TOOL_TIMEOUT_MS,
            'Daily summary tool timeout'
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

      // RAG retrieval + tool retrieval
      const ragContext = await this.buildRagContext(message)
      const toolContext = await this.buildToolContext(message)
      const combinedContext = [ragContext, toolContext, context]
        .filter(Boolean)
        .join('\n\n')

      // LangChain chain: PromptTemplate -> ChatOpenAI
      const chain = RunnableSequence.from([this.answerPrompt, this.model])
      const llmResponse: any = await this.withTimeout(
        chain.invoke({
          context: combinedContext || 'No additional context provided.',
          message
        }),
        this.LLM_TIMEOUT_MS,
        'LLM timeout'
      )

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
