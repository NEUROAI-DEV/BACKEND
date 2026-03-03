import { z } from 'zod'

const LogLevelEnum = z.enum(['error', 'warn', 'info'])

export const CreateLogSchema = z.object({
  logLevel: LogLevelEnum,
  logMessage: z.string().min(1),
  logSource: z
    .union([z.string().max(255), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? null : (v ?? null))),
  logMeta: z
    .union([z.string(), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? null : (v ?? null)))
})

export const FindAllLogsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  level: z
    .union([LogLevelEnum, z.literal('')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  search: z
    .union([z.string(), z.literal('')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type ICreateLog = z.infer<typeof CreateLogSchema>
export type IFindAllLog = z.infer<typeof FindAllLogsSchema>
