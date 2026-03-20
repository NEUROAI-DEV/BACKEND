import { z } from 'zod'

export const CreateLivePredictSchema = z.object({
  livePredictSymbol: z.string().min(1, 'livePredictSymbol is required'),
  livePredictIcon: z.string().min(1, 'livePredictIcon is required')
})

export const UpdateLivePredictSchema = z.object({
  livePredictId: z.coerce.number().int().positive(),
  livePredictCoinSymbol: z
    .string()
    .min(1, 'livePredictCoinSymbol is required')
    .optional(),
  livePredictCoinIcon: z.string().min(1, 'livePredictCoinIcon is required').optional()
})

export const FindDetailLivePredictSchema = z.object({
  livePredictId: z.coerce.number().int().positive()
})

export const RemoveLivePredictSchema = z.object({
  livePredictId: z.coerce.number().int().positive()
})

export const FindAllLivePredictSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  livePredictCoinSymbol: z.string().optional(),
  pagination: z.boolean().optional()
})

export type IFindAllLivePredict = z.infer<typeof FindAllLivePredictSchema>
export type ICreateLivePredict = z.infer<typeof CreateLivePredictSchema>
export type IUpdateLivePredict = z.infer<typeof UpdateLivePredictSchema>
export type IFindDetailLivePredict = z.infer<typeof FindDetailLivePredictSchema>
export type IRemoveLivePredict = z.infer<typeof RemoveLivePredictSchema>
