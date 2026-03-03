import { z } from 'zod'

const stringAllowEmpty = () => z.union([z.string(), z.literal('')])

export const FindAllNewsSchema = z.object({
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

export const FindDetailNewsSchema = z.object({
  newsId: z.coerce.number().int().positive()
})

export type IFindAllNews = z.infer<typeof FindAllNewsSchema>
export type IFindDetailNews = z.infer<typeof FindDetailNewsSchema>
