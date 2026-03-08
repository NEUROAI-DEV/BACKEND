import { z } from 'zod'

/**
 * Query schema for GET /watchlist.
 * ids: comma-separated coin IDs (e.g. bitcoin,ethereum,solana)
 */
export const GetWatchListQuerySchema = z.object({
  ids: z
    .string()
    .min(1, 'ids is required (comma-separated coin IDs, e.g. bitcoin,ethereum,solana)')
    .transform((s) =>
      s
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    )
    .refine((arr) => arr.length > 0, 'At least one coin id is required'),
  vs_currency: z.string().min(1).max(10).default('usd')
})

export type IGetWatchListQuery = z.infer<typeof GetWatchListQuerySchema>

/**
 * Body schema for POST /watchlist (create).
 * watchListCoinIds: comma-separated string only (e.g. "bitcoin,ethereum,solana,pepe")
 */
export const CreateWatchListSchema = z.object({
  watchListCoinIds: z
    .string()
    .min(
      1,
      'watchListCoinIds is required (comma-separated, e.g. bitcoin,ethereum,solana,pepe)'
    )
})

export type ICreateWatchList = z.infer<typeof CreateWatchListSchema>

/**
 * Params schema for DELETE /watchlist/:watchListId
 */
export const DeleteWatchListSchema = z.object({
  watchListId: z.coerce.number().int().positive()
})

export type IDeleteWatchList = z.infer<typeof DeleteWatchListSchema>
