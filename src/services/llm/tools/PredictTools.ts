import { tool } from 'langchain'
import * as z from 'zod'

const PredictionItemSchema = z.object({
  timestamp: z.number(),
  datetime: z.string(),
  predicted_price: z.number(),
  change_amount: z.number().optional(),
  change_percent: z.number().optional()
})

const ForecastSchema = z.object({
  symbol: z.string().min(1),
  interval: z.string().min(1),
  last_price: z.number(),
  change_percent: z.number().optional(),
  predictions: z.array(PredictionItemSchema).min(1)
})

export type ForecastInput = z.infer<typeof ForecastSchema>

export type PredictModelFillResult = {
  predictPrice: number
  predictTakeProfit: number
  predictStopLoss: number
  predictEntryPrice: number
  predictReason: string
  predictPotentialGain: number
  predictPotentialLoss: number
  predictionDirection: 'BULLISH' | 'SIDEWAYS' | 'BEARISH'
}

function round(num: number, decimals: number = 8): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

function pct(from: number, to: number): number {
  if (!Number.isFinite(from) || from === 0) return 0
  return ((to - from) / from) * 100
}

function computePredictFill(forecast: ForecastInput): PredictModelFillResult {
  const entry = forecast.last_price
  const predictedPrices = forecast.predictions
    .map((p) => p.predicted_price)
    .filter((n) => Number.isFinite(n))

  const maxPred = Math.max(...predictedPrices)
  const minPred = Math.min(...predictedPrices)
  const lastPred = predictedPrices[predictedPrices.length - 1] ?? entry

  const directionEnum: 'BULLISH' | 'SIDEWAYS' | 'BEARISH' =
    lastPred > entry ? 'BULLISH' : lastPred < entry ? 'BEARISH' : 'SIDEWAYS'

  // Directional heuristic:
  // - BULLISH: TP above entry, SL below entry
  // - BEARISH: TP below entry (profit on short), SL above entry
  // - SIDEWAYS: keep symmetric bounds
  const takeProfit = directionEnum === 'BEARISH' ? minPred : maxPred
  const stopLoss = directionEnum === 'BEARISH' ? maxPred : minPred

  const potentialGain = Math.abs(pct(entry, takeProfit))
  const potentialLoss = Math.abs(pct(entry, stopLoss))

  const directionLabel =
    directionEnum === 'BULLISH'
      ? 'BULLISH (upward forecast)'
      : directionEnum === 'BEARISH'
        ? 'BEARISH (downward forecast)'
        : 'SIDEWAYS'

  const tp1 = entry + (takeProfit - entry) * (1 / 3)
  const tp2 = entry + (takeProfit - entry) * (2 / 3)
  const tp3 = takeProfit

  const reason = [
    `Forecast-based signal for ${forecast.symbol} (${forecast.interval}).`,
    `Direction: ${directionLabel}.`,
    `Entry: ${round(entry, 8)}.`,
    `Take Profit (TP):`,
    `TP1: ${round(tp1, 8)} (${round(Math.abs(pct(entry, tp1)), 4)}%)`,
    `TP2: ${round(tp2, 8)} (${round(Math.abs(pct(entry, tp2)), 4)}%)`,
    `TP3: ${round(tp3, 8)} (${round(Math.abs(pct(entry, tp3)), 4)}%)`,
    `Potential gain to TP3: ${round(potentialGain, 4)}%.`,
    `Stop Loss: ${round(stopLoss, 8)} (${round(potentialLoss, 4)}%).`,
    typeof forecast.change_percent === 'number'
      ? `Recent change: ${round(forecast.change_percent, 4)}%.`
      : undefined
  ]
    .filter(Boolean)
    .join(' ')

  return {
    predictPrice: round(entry, 8),
    predictTakeProfit: round(takeProfit, 8),
    predictStopLoss: round(stopLoss, 8),
    predictEntryPrice: round(entry, 8),
    predictReason: reason,
    predictPotentialGain: round(potentialGain, 8),
    predictPotentialLoss: round(potentialLoss, 8),
    predictionDirection: directionEnum
  }
}

/**
 * TOOL: Convert forecast response into PredictModel fields.
 * Input: forecast response (symbol, interval, last_price, predictions[])
 * Output: fields to fill `predictModel.ts` (predictPrice, TP, SL, entry, reason, potential gain/loss).
 */
export const predictModelFillFromForecastTool = tool(
  async (forecast: ForecastInput): Promise<PredictModelFillResult> => {
    const validated = ForecastSchema.parse(forecast)
    return computePredictFill(validated)
  },
  {
    name: 'predict_model_fill_from_forecast',
    description:
      'Compute PredictModel fields (price, entry, take profit, stop loss, reason, potential gain/loss) from a forecast response.',
    schema: ForecastSchema
  }
)
