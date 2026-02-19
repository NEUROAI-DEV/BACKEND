import { z } from 'zod'

const screenerProfileEnum = z.enum(['SCALPING', 'SWING', 'INVEST'])
const stringAllowEmpty = () => z.string().or(z.literal(''))

/* ============================= */
/* CREATE SCREENER (body) */
/* ============================= */

export const createScreenerSchema = z.object({
  screenerCoinSymbol: z.string().max(100).trim(),
  screenerProfile: screenerProfileEnum,
  screenerCoinImage: z.union([z.string().max(255), z.literal('')]).optional()
})

export type CreateScreenerInput = z.infer<typeof createScreenerSchema>

/* ============================= */
/* FIND ALL SCREENER (query) */
/* ============================= */

export const findAllScreenerSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).default(10),
  search: stringAllowEmpty().optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type FindAllScreenerInput = z.infer<typeof findAllScreenerSchema>

/* ============================= */
/* REMOVE SCREENER (params) */
/* ============================= */

export const removeScreenerSchema = z.object({
  screenerId: z.coerce.number().int().positive()
})

export type RemoveScreenerInput = z.infer<typeof removeScreenerSchema>
