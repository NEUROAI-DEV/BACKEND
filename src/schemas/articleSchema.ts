import { z } from 'zod'

// Zod versi jwtPayload hanya untuk kebutuhan schema artikel.
// Payload JWT asli biasanya di-inject oleh middleware auth, bukan dikirim dari client.
const jwtPayloadSchema = z
  .object({
    userId: z.number().optional(),
    userRole: z.string().optional(),
    userName: z.string().optional(),
    userEmail: z.string().optional(),
    iat: z.unknown().optional()
  })
  .optional()

/*
  Helper untuk menggantikan Joi.allow('')
  -> artinya string boleh kosong
*/
const stringAllowEmpty = () => z.string().or(z.literal(''))

/* ============================= */
/* CREATE ARTICLE (body) */
/* ============================= */

export const createArticleSchema = z.object({
  jwtPayload: jwtPayloadSchema,

  articleTitle: z.string().max(100).or(z.literal('')),

  articleDescription: stringAllowEmpty(),

  articleImage: stringAllowEmpty().optional()
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>

/* ============================= */
/* UPDATE ARTICLE (body) */
/* ============================= */

export const updateArticleSchema = z.object({
  jwtPayload: jwtPayloadSchema,

  articleId: z.number().int().positive(),

  articleTitle: z.string().max(100).or(z.literal('')).optional(),

  articleDescription: stringAllowEmpty().optional(),

  articleImage: stringAllowEmpty().optional()
})

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>

/* ============================= */
/* FIND DETAIL ARTICLE (params) */
/* ============================= */

export const findDetailArticleSchema = z.object({
  articleId: z.coerce.number().int().positive()
})

export type FindDetailArticleInput = z.infer<typeof findDetailArticleSchema>

/* ============================= */
/* REMOVE ARTICLE (body) */
/* ============================= */

export const removeArticleSchema = z.object({
  jwtPayload: jwtPayloadSchema,

  articleId: z.number().int().positive()
})

export type RemoveArticleInput = z.infer<typeof removeArticleSchema>

/* ============================= */
/* FIND ALL ARTICLE (query) */
/* ============================= */

export const findAllArticleSchema = z.object({
  page: z.coerce.number().int().optional(),

  size: z.coerce.number().int().optional(),

  search: stringAllowEmpty().optional(),

  pagination: z.string().optional()
})

export type FindAllArticleInput = z.infer<typeof findAllArticleSchema>
