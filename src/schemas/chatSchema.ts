import { z } from 'zod'

const stringAllowEmptyNull = () =>
  z.union([z.string(), z.literal(''), z.null()]).optional()

export const ChatRequestSchema = z.object({
  message: z.string().min(1),
  context: z.union([z.string(), z.literal(''), z.null()])
})

const ChatChunkSchema = z.object({
  content: z.string().min(1),
  source: z.union([z.string(), z.literal(''), z.null()])
})

export const IndexChatRequestSchema = z.object({
  documents: z.array(ChatChunkSchema).min(1).max(100)
})

export const FindAllIndexingsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  source: stringAllowEmptyNull(),
  sourceType: z.union([z.enum(['pdf', 'json']), z.literal(''), z.null()]).optional(),
  search: stringAllowEmptyNull()
})

export const DeleteIndexingParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'id must be a positive integer' })
})

export type IDeleteIndexingParams = z.infer<typeof DeleteIndexingParamsSchema>
export type IChatRequest = z.infer<typeof ChatRequestSchema>
export type IIndexChatRequest = z.infer<typeof IndexChatRequestSchema>
export type IFindAllIndexings = z.infer<typeof FindAllIndexingsSchema>
