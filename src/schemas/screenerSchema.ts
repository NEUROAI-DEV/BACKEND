import { z } from 'zod'

export const ScreenerProfileEnum = z.enum(['SCALPING', 'SWING', 'INVEST'])
const stringAllowEmpty = () => z.string().or(z.literal(''))

export const CreateScreenerSchema = z.object({
  screenerCoinSymbol: z.string().max(100).trim(),
  screenerProfile: ScreenerProfileEnum,
  screenerCoinImage: z.union([z.string().max(255), z.literal('')]).optional()
})

export const FindAllScreenerSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).default(10),
  search: stringAllowEmpty().optional(),
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
