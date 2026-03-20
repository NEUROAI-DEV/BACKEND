import { tool } from 'langchain'
import * as z from 'zod'
import { DailySummaryStoreService } from '../../DailySummaryStoreService'

export type DailySummaryToolResult =
  | {
      exists: false
      message: string
    }
  | {
      exists: true
      dailySummaryId: number
      dailySummaryDate: string
      dailySummaryMarketSentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH'
      dailySummaryConfidence: number
      dailySummarySummary: string
      dailySummaryHighlights: string[]
    }

export const dailySummaryTodayTool = tool(
  async (): Promise<DailySummaryToolResult> => {
    // Ensure we always have data: generate once when missing.
    const dailySummary = await DailySummaryStoreService.getOrCreate(new Date())

    if (!dailySummary) {
      return {
        exists: false,
        message: 'No daily summary found for today (Asia/Jakarta).'
      }
    }

    type DailySummaryPlain = {
      dailySummaryId: number
      dailySummaryDate: string
      dailySummaryMarketSentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH'
      dailySummaryConfidence: string | number
      dailySummarySummary: string
      dailySummaryHighlights: string[]
    }

    const plain = dailySummary.get({ plain: true }) as DailySummaryPlain

    return {
      exists: true,
      dailySummaryId: Number(plain.dailySummaryId),
      dailySummaryDate: String(plain.dailySummaryDate),
      dailySummaryMarketSentiment: plain.dailySummaryMarketSentiment,
      dailySummaryConfidence: Number(plain.dailySummaryConfidence),
      dailySummarySummary: String(plain.dailySummarySummary),
      dailySummaryHighlights: Array.isArray(plain.dailySummaryHighlights)
        ? (plain.dailySummaryHighlights as string[])
        : []
    }
  },
  {
    name: 'daily_summary_today',
    description:
      'Get the daily market sentiment summary for today (Asia/Jakarta timezone). Returns sentiment, confidence, summary and highlights.',
    schema: z.object({})
  }
)
