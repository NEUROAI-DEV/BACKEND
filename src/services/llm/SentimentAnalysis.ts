import { LLMService } from './LlmServices'
import { SentimentSchema } from '../../schemas/SentimentAnalysisSchema'
import type { ISentimentResult, ICoinImpact } from '../../schemas/SentimentAnalysisSchema'
import { CoinGeckoService } from '../external/CoinGeckoService'

const SENTIMENT_PROMPT = `Analyze the sentiment of this crypto news.

Rules:
- sentiment: POSITIVE, NEUTRAL, or NEGATIVE based on market impact tone.
- category: Use TRENDING only for very high-value or breaking news (major events, regulatory news, major hacks, large price-moving events). Use NORMAL for regular updates.
- affectedCoinId: Always return this field. When category is TRENDING and the news clearly impacts one cryptocurrency, set to CoinGecko coin id (lowercase, e.g. bitcoin, ethereum, solana, pepe). Otherwise use empty string.
- reason: Short explanation in one or two sentences.`

export class SentimentService {
  private static model = LLMService.create().withStructuredOutput(SentimentSchema)

  static async analyze(text: string): Promise<ISentimentResult> {
    const raw = await this.model.invoke(`${SENTIMENT_PROMPT}\n\n---\n\n${text}`)

    let coinImpact: ICoinImpact | null = null
    if (raw.affectedCoinId?.trim()) {
      const coins = await CoinGeckoService.getCoinsByIds(raw.affectedCoinId.trim(), 'usd')

      console.log('coins---------------', coins)
      if (coins.length > 0) {
        const c = coins[0]
        coinImpact = {
          id: c.id,
          name: c.name,
          symbol: c.symbol ?? '',
          current_price: c.current_price ?? null,
          market_cap: c.market_cap ?? null,
          market_cap_rank: c.market_cap_rank ?? null,
          image: c.image ?? null
        }
      }
    }

    return {
      sentiment: raw.sentiment,
      confidence: raw.confidence,
      category: raw.category,
      reason: raw.reason,
      affectedCoinId: raw.affectedCoinId ?? '',
      coinImpact: coinImpact ?? undefined
    }
  }
}
