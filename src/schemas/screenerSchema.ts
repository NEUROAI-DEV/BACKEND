import { z } from 'zod'

export const ScreenerProfileEnum = z.enum(['SCALPING', 'SWING', 'INVEST'])
const stringAllowEmpty = () => z.string().or(z.literal(''))

/** Category for GET /screeners: loser, gainers, markets, trending */
export const ScreenerCategoryEnum = z.enum(['losers', 'gainers', 'markets', 'trending'])

export const CreateScreenerSchema = z.object({
  screenerCoinSymbol: z.string().max(100).trim(),
  screenerProfile: ScreenerProfileEnum,
  screenerCoinImage: z.union([z.string().max(255), z.literal('')]).optional()
})

export const FindAllScreenerSchema = z.object({
  category: ScreenerCategoryEnum,
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  search: stringAllowEmpty().optional(),
  minVolume: z.coerce.number().min(0).optional(),
  minLiquidity: z.coerce.number().min(0).optional(),
  vs_currency: z.string().min(1).max(10).optional(),
  order: z
    .enum([
      'market_cap_desc',
      'market_cap_asc',
      'volume_desc',
      'volume_asc',
      'id_asc',
      'id_desc',
      'gecko_desc',
      'gecko_asc',
      'price_change_percentage_24h_desc',
      'price_change_percentage_24h_asc'
    ])
    .optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export const RemoveScreenerSchema = z.object({
  screenerId: z.coerce.number().int().positive()
})

export type ICreateScreener = z.infer<typeof CreateScreenerSchema>
export type IFindAllScreener = z.infer<typeof FindAllScreenerSchema>
export type IRemoveScreener = z.infer<typeof RemoveScreenerSchema>
