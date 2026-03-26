import { z } from 'zod'

export const FindAllPredictSchema = z.object({
  page: z.coerce.number().int().optional(),
  size: z.coerce.number().int().optional(),
  predictSymbol: z.string().optional(),
  predictType: z.enum(['SCALPING', 'SWING', 'INVESTING']).optional(),
  pagination: z
    .string()
    .optional()
    .transform((v) => v === 'true')
})

export type IFindAllPredict = z.infer<typeof FindAllPredictSchema>

export const RunPredictSchema = z.object({
  type: z.enum(['SCALPING', 'SWING', 'INVESTING']),
  symbol: z.string().min(1),
  icon: z.string().min(1)
})

export type IRunPredict = z.infer<typeof RunPredictSchema>

export const RemovePredictSchema = z.object({
  predictId: z.coerce.number().int().positive()
})

export type IRemovePredict = z.infer<typeof RemovePredictSchema>

export const UpdateAllPredictByUserSchema = z.object({})

export type IUpdateAllPredictByUser = z.infer<typeof UpdateAllPredictByUserSchema>
