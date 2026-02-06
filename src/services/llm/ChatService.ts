import { LLMService } from './LlmServices'

export class ChatService {
  private static model = LLMService.create()

  static async chat(message: string, context?: string) {
    const systemPrompt =
      'You are a helpful AI assistant specialized in crypto, trading, and general questions. Answer clearly, safely, and concisely.'

    const userContent = context
      ? `Context:\n${context}\n\nUser message:\n${message}`
      : message

    const llmResponse: any = await this.model.invoke([
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userContent
      }
    ])

    let reply: string

    if (Array.isArray(llmResponse?.content)) {
      reply = llmResponse.content
        .map((chunk: any) => {
          if (typeof chunk === 'string') return chunk
          if (typeof chunk?.text === 'string') return chunk.text
          return ''
        })
        .join('')
        .trim()
    } else {
      reply = String(llmResponse?.content ?? '').trim()
    }

    return { reply }
  }
}

