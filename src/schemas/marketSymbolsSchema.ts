import { z } from 'zod'

export const FindUsdtSymbolsSchema = z.object({
  search: z.string().or(z.literal('')).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

const CoinGeckoOrderValues = z.enum([
  'market_cap_desc',
  'market_cap_asc',
  'volume_desc',
  'volume_asc',
  'id_asc',
  'id_desc'
])

export const FindAllCoinSchema = z.object({
  vs_currency: z.string().or(z.literal('')).optional().default('usd'),
  order: z.string().or(z.literal('')).optional().default('market_cap_desc'),
  per_page: z.number().int().min(1).max(250).default(20),
  page: z.number().int().min(1).default(1),
  search: z.string().or(z.literal('')).optional()
})

export type IFindUsdtSymbols = z.infer<typeof FindUsdtSymbolsSchema>
export type IFindAllCoin = z.infer<typeof FindAllCoinSchema>
