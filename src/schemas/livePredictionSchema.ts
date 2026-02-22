import Joi from 'joi'
import { z } from 'zod'
import { JwtPayloadSchema } from './JwtPayloadSchema'

export const LivePredictionSchema = z.object({
  symbol: z.string(),
  profile: z.enum(['SCALPING', 'SWING', 'LONG']),
  trend: z.enum(['BULLISH', 'BEARISH', 'SIDEWAYS']),
  confidence: z.number().min(0).max(100),
  entryZone: z.object({
    buy: z.string(),
    sell: z.string()
  }),
  stopLoss: z.string(),
  takeProfit: z.string(),
  reasoning: z.string()
})

export const FindLivePredictionSchema = Joi.object({
  jwtPayload: JwtPayloadSchema,
  symbol: Joi.string().required(),
  profile: Joi.string().valid('SCALPING', 'SWING', 'INVEST').required()
})

export type ILivePrediction = z.infer<typeof LivePredictionSchema>
export type IFindLivePrediction = z.infer<typeof FindLivePredictionSchema>
