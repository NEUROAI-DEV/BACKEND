import { z } from 'zod'

export const CreateLivePredictSchema = z.object({
  livePredictSymbols: z
    .string()
    .min(1, 'livePredictSymbols is required (comma-separated, e.g. btc,eth,sol)')
})

export const UpdateLivePredictSchema = z.object({
  livePredictId: z.coerce.number().int().positive(),
  livePredictSymbols: z
    .string()
    .min(1, 'livePredictSymbols is required (comma-separated)')
    .optional()
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
  livePredictUserId: z.coerce.number().int().positive().optional()
})

export type IFindAllLivePredict = z.infer<typeof FindAllLivePredictSchema>
export type ICreateLivePredict = z.infer<typeof CreateLivePredictSchema>
export type IUpdateLivePredict = z.infer<typeof UpdateLivePredictSchema>
export type IFindDetailLivePredict = z.infer<typeof FindDetailLivePredictSchema>
export type IRemoveLivePredict = z.infer<typeof RemoveLivePredictSchema>
