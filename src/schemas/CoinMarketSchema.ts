import { z } from 'zod'

export const FindUsdtSymbolsSchema = z.object({
  search: z.string().or(z.literal('')).optional(),
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20)
})

export const FindAllCoinSchema = z.object({
  vs_currency: z.string().or(z.literal('')).optional().default('usd'),
  order: z.string().or(z.literal('')).optional().default('market_cap_desc'),
  size: z.coerce.number().int().min(1).max(250).default(20),
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().or(z.literal('')).optional()
})

export type IFindUsdtSymbols = z.infer<typeof FindUsdtSymbolsSchema>
export type IFindAllCoin = z.infer<typeof FindAllCoinSchema>
