import { z } from 'zod'

const logLevelEnum = z.enum(['error', 'warn', 'info'])

/* ============================= */
/* CREATE LOG (body) */
/* ============================= */

export const createLogSchema = z.object({
  logLevel: logLevelEnum,
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

export type CreateLogInput = z.infer<typeof createLogSchema>

/* ============================= */
/* FIND ALL LOGS (query) */
/* ============================= */

export const findAllLogsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  level: z
    .union([logLevelEnum, z.literal('')])
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

export type FindAllLogsInput = z.infer<typeof findAllLogsSchema>
