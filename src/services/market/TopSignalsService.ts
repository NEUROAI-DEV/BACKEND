import { BinanceService } from '../external/BinanceService'

export interface TopSignal {
  symbol: string
  changePercent: number
}

export class TopSignalsService {
  static async getTopSignals(limit = 5) {
    const tickers = await BinanceService.get24hTickers()

    const mapped = tickers
      .filter((t) => t.symbol.endsWith('USDT'))
      .map((t) => ({
        symbol: t.symbol,
        changePercent: Number(t.priceChangePercent)
      }))
      .filter((t) => !Number.isNaN(t.changePercent))

    const gainers = [...mapped]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit)

    const losers = [...mapped]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit)

    return {
      gainers,
      losers,
      generatedAt: new Date().toISOString()
    }
  }
}
