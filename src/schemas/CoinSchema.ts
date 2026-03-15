import { z } from 'zod'

export const CreateCoinSchema = z.object({
  coinName: z.string().min(1).max(255),
  coinSymbol: z.string().min(1).max(255),
  coinImage: z.string().max(255).optional()
})

export const UpdateCoinSchema = z.object({
  coinId: z.coerce.number().int().positive(),
  coinName: z.string().min(1).max(255).optional(),
  coinSymbol: z.string().min(1).max(255).optional(),
  coinImage: z.string().max(255).optional()
})

export const FindDetailCoinSchema = z.object({
  coinId: z.coerce.number().int().positive()
})

export const RemoveCoinSchema = z.object({
  coinId: z.coerce.number().int().positive()
})

export const FindAllCoinSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  search: z.string().optional()
})

export type IFindAllCoin = z.infer<typeof FindAllCoinSchema>
export type ICreateCoin = z.infer<typeof CreateCoinSchema>
export type IUpdateCoin = z.infer<typeof UpdateCoinSchema>
export type IFindDetailCoin = z.infer<typeof FindDetailCoinSchema>
export type IRemoveCoin = z.infer<typeof RemoveCoinSchema>
