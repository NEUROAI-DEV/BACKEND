import { z } from 'zod'

export const CreateTransactionSchema = z.object({
  transactionUserId: z.coerce.number().int().positive(),
  transactionSubscriptionId: z.coerce.number().int().positive().optional(),
  transactionAmount: z.coerce.number().nonnegative(),
  transactionStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).default('PENDING'),
  transactionProvider: z.string().max(50).optional(),
  transactionExternalId: z.string().max(100).optional(),
  transactionErrorMessage: z.string().optional(),
  transactionPaidAt: z.coerce.date().optional()
})

export const UpdateTransactionSchema = z.object({
  transactionId: z.coerce.number().int().positive(),
  transactionAmount: z.coerce.number().nonnegative().optional(),
  transactionStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  transactionProvider: z.string().max(50).optional(),
  transactionExternalId: z.string().max(100).optional(),
  transactionErrorMessage: z.string().optional(),
  transactionPaidAt: z.coerce.date().optional()
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
  transactionStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional()
})

export type IFindAllTransaction = z.infer<typeof FindAllTransactionSchema>
export type ICreateTransaction = z.infer<typeof CreateTransactionSchema>
export type IUpdateTransaction = z.infer<typeof UpdateTransactionSchema>
export type IFindDetailTransaction = z.infer<typeof FindDetailTransactionSchema>
export type IRemoveTransaction = z.infer<typeof RemoveTransactionSchema>
