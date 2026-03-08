import { z } from 'zod'

/** Schema for LLM structured output. Use plain types only (no .default/.describe) for OpenAI extract format. */
export const SentimentSchema = z.object({
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  confidence: z.number().min(0).max(1),
  category: z.enum(['TRENDING', 'NORMAL']),
  reason: z.string(),
  affectedCoinId: z.string()
})

/** Shape of coinImpact filled from CoinGecko when category is TRENDING and affectedCoinId is set. */
export const CoinImpactSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
  current_price: z.number().nullable().optional(),
  market_cap: z.number().nullable().optional(),
  market_cap_rank: z.number().nullable().optional(),
  image: z.string().nullable().optional()
})

/** Final sentiment result: LLM output + coinImpact from CoinGecko when applicable. */
export const SentimentResultSchema = SentimentSchema.extend({
  coinImpact: CoinImpactSchema.nullable().optional()
})

export type ISentimentResult = z.infer<typeof SentimentResultSchema>
export type ICoinImpact = z.infer<typeof CoinImpactSchema>
