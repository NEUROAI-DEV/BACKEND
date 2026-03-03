import { LLMService } from './LlmServices'
import { SentimentSchema } from '../../schemas/SentimentAnalysisSchema'

export class SentimentService {
  private static model = LLMService.create().withStructuredOutput(SentimentSchema)

  static async analyze(text: string) {
    return await this.model.invoke(
      `Analyze the sentiment of this crypto news:\n\n${text}`
    )
  }
}
