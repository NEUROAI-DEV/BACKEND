import { z } from 'zod'

const DirectionEnum = z.enum(['gainers', 'losers'])
const PriceChangePeriodEnum = z.enum(['1h', '24h', '7d', '14d', '30d'])

/**
 * Query schema for GET /screeners/top-averages (CoinGecko getTopMovers).
 */
export const GetTopAveragesQuerySchema = z.object({
  vs_currency: z.string().min(1).max(10).default('usd'),
  direction: DirectionEnum.default('gainers'),
  size: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  minVolume: z.coerce.number().min(0).default(0),
  minLiquidity: z.coerce.number().min(0).default(0),
  price_change_percentage: PriceChangePeriodEnum.default('24h')
})

export type IGetTopAveragesQuery = z.infer<typeof GetTopAveragesQuerySchema>
