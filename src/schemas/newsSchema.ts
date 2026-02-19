import { z } from 'zod'

const stringAllowEmpty = () => z.union([z.string(), z.literal('')])

/* ============================= */
/* FIND ALL NEWS (query) */
/* ============================= */

export const findAllNewsSchema = z.object({
  page: z.coerce.number().int().nonnegative().optional(),
  size: z.coerce.number().int().positive().optional(),
  search: stringAllowEmpty()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  startDate: stringAllowEmpty()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  endDate: stringAllowEmpty()
    .optional()
    .transform((v) => (v === '' ? undefined : v))
})

export type FindAllNewsInput = z.infer<typeof findAllNewsSchema>

/* ============================= */
/* FIND DETAIL NEWS (params) */
/* ============================= */

export const findDetailNewsSchema = z.object({
  newsId: z.coerce.number().int().positive()
})

export type FindDetailNewsInput = z.infer<typeof findDetailNewsSchema>
