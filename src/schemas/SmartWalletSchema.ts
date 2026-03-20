import { z } from 'zod'

export const CreateSmartWalletSchema = z.object({
  smartWalletAddress: z.string().min(1).max(255),
  smartWalletName: z.string().min(1).max(255)
})

export const UpdateSmartWalletSchema = z.object({
  smartWalletId: z.coerce.number().int().positive(),
  smartWalletAddress: z.string().min(1).max(255).optional(),
  smartWalletName: z.string().min(1).max(255).optional()
})

export const FindDetailSmartWalletSchema = z.object({
  smartWalletId: z.coerce.number().int().positive()
})

export const RemoveSmartWalletSchema = z.object({
  smartWalletId: z.coerce.number().int().positive()
})

export const FindAllSmartWalletSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type IFindAllSmartWallet = z.infer<typeof FindAllSmartWalletSchema>
export type ICreateSmartWallet = z.infer<typeof CreateSmartWalletSchema>
export type IUpdateSmartWallet = z.infer<typeof UpdateSmartWalletSchema>
export type IFindDetailSmartWallet = z.infer<typeof FindDetailSmartWalletSchema>
export type IRemoveSmartWallet = z.infer<typeof RemoveSmartWalletSchema>
