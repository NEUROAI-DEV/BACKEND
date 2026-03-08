import { z } from 'zod'

export const SentimentSchema = z.object({
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  confidence: z.number().min(0).max(1),
  category: z.enum(['HOT', 'REGULAR']),
  reason: z.string()
})

export type ISentimentResult = z.infer<typeof SentimentSchema>
