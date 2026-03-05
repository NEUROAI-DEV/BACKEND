import { z } from 'zod'

/**
 * Query schema for GET trending coins.
 * No required params; optional params can be added here (e.g. source filter, limit).
 */
export const GetTrendingCoinsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional()
})

export type IGetTrendingCoinsQuery = z.infer<typeof GetTrendingCoinsQuerySchema>
