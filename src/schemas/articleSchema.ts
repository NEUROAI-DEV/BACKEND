import { z } from 'zod'
import { JwtPayloadSchema } from './JwtPayloadSchema'

export const CreateArticleSchema = z.object({
  jwtPayload: JwtPayloadSchema,
  articleTitle: z.string().max(100).or(z.literal('')),
  articleDescription: z.string().optional(),
  articleImage: z.string().optional()
})

export const UpdateArticleSchema = z.object({
  jwtPayload: JwtPayloadSchema,
  articleId: z.number().int().positive(),
  articleTitle: z.string().max(100).or(z.literal('')).optional(),
  articleDescription: z.string().optional(),
  articleImage: z.string().optional()
})

export const FindDetailArticleSchema = z.object({
  articleId: z.coerce.string().transform((v) => parseInt(v))
})

export const RemoveArticleSchema = z.object({
  jwtPayload: JwtPayloadSchema,
  articleId: z.coerce.string().transform((v) => parseInt(v))
})

export const FindAllArticleSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  search: z.string().optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type IFindAllArticle = z.infer<typeof FindAllArticleSchema>
export type IRemoveArticle = z.infer<typeof RemoveArticleSchema>
export type ICreateArticle = z.infer<typeof CreateArticleSchema>
export type IFindDetailArticle = z.infer<typeof FindDetailArticleSchema>
export type IUpdateArticle = z.infer<typeof UpdateArticleSchema>
