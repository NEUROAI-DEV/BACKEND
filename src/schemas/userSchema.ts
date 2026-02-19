import { z } from 'zod'

const stringAllowEmpty = () => z.string().or(z.literal(''))

/* ============================= */
/* FIND ALL USERS (query) */
/* ============================= */

export const findAllUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).default(10),
  search: stringAllowEmpty()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type FindAllUsersInput = z.infer<typeof findAllUsersSchema>
