import { Op } from 'sequelize'
import { NewsModel } from '../../models/newsMode'
import { LLMService } from './LlmServices'
import { DailySummarySchema } from '../../schemas/DailySummarySchema'
import { AppError } from '../../utilities/errorHandler'
import logger from '../../../logs'
import { StatusCodes } from 'http-status-codes'

type SentimentConfidence = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

export class DailySummaryService {
  private static model = LLMService.create().withStructuredOutput(DailySummarySchema)

  static async generate(date: Date) {
    try {
      /**
       * 1. Define start and end of the day
       */
      const start = new Date(date)
      start.setHours(0, 0, 0, 0)

      const end = new Date(date)
      end.setHours(23, 59, 59, 999)
      /**
       * 2. Fetch today's news
       */
      const news = await NewsModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end]
          }
        },
        order: [['createdAt', 'DESC']],
        limit: 50
      })

      if (!news.length) {
        throw new Error('No news found for today')
      }

      /**
       * 3. Initialize sentiment statistics
       */
      const stats: Record<SentimentConfidence, number> = {
        POSITIVE: 0,
        NEUTRAL: 0,
        NEGATIVE: 0
      }

      /**
       * 4. Build news lines and sentiment distribution
       */
      const newsLines = news.map((n) => {
        const confidence = n.newsSentimentConfidence as SentimentConfidence | undefined

        if (confidence && confidence in stats) {
          stats[confidence]++
        }

        return `- ${n.newsTitle} (${n.newsSentiment})`
      })

      /**
       * 5. Construct prompt for LLM
       */
      const prompt = `
You are a professional crypto market analyst.

Using the following daily crypto news and sentiment distribution,
generate a structured daily market summary.

Sentiment statistics:
- Positive: ${stats.POSITIVE}
- Neutral: ${stats.NEUTRAL}
- Negative: ${stats.NEGATIVE}

News:
${newsLines.join('\n')}

Rules:
- Be concise
- Focus on market direction
- Avoid speculation beyond given data
`

      /**
       * 6. Invoke LLM and return structured output
       */
      return await this.model.invoke(prompt)
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[DailySummaryService] generate failed: ${String(error)}`)
      throw new AppError(
        'Failed to generate daily summary',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
