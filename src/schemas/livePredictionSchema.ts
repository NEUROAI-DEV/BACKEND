import { z } from 'zod'

export const LivePredictionSchema = z.object({
  symbol: z.string(),
  profile: z.enum(['SCALPING', 'SWING', 'INVEST']),
  bias: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL']),
  currentPrice: z.number(),
  expectedRange: z.object({
    low: z.number(),
    high: z.number()
  }),
  entryZone: z.object({
    buy: z.number().optional(),
    sell: z.number().optional()
  }),
  confidence: z.number().min(0).max(1),
  riskNote: z.string()
})
