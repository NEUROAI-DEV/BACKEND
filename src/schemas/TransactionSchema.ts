import { z } from 'zod'

export const CreateTransactionSchema = z.object({
  transactionSubscriptionPlanId: z.coerce.number().int().positive().optional(),
  transactionProvider: z.string().max(50).optional(),
  transactionExternalId: z.string().max(100).optional()
})

export const UpdateTransactionSchema = z.object({
  transactionId: z.coerce.number().int().positive(),
  transactionStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional()
})

export const FindDetailTransactionSchema = z.object({
  transactionId: z.coerce.number().int().positive()
})

export const RemoveTransactionSchema = z.object({
  transactionId: z.coerce.number().int().positive()
})

export const FindAllTransactionSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  transactionUserId: z.coerce.number().int().positive().optional(),
  transactionStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  search: z.string().optional()
})

export type IFindAllTransaction = z.infer<typeof FindAllTransactionSchema>
export type ICreateTransaction = z.infer<typeof CreateTransactionSchema>
export type IUpdateTransaction = z.infer<typeof UpdateTransactionSchema>
export type IFindDetailTransaction = z.infer<typeof FindDetailTransactionSchema>
export type IRemoveTransaction = z.infer<typeof RemoveTransactionSchema>
