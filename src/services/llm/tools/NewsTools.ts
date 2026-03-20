import { tool } from 'langchain'
import * as z from 'zod'
import { NewsServices } from '../../NewsServices'

type TrendingNewsToolResult = {
  category: 'TRENDING'
  totalItems: number
  items: unknown[]
}

export const trendingNewsTool = tool(
  async ({ page = 1, size = 5, search = '' }): Promise<TrendingNewsToolResult> => {
    const result = await NewsServices.findAll({
      page,
      size,
      search,
      pagination: true,
      startDate: undefined,
      endDate: undefined,
      category: 'TRENDING'
    })

    return {
      category: 'TRENDING',
      totalItems: result.totalItems ?? 0,
      items: Array.isArray(result.items) ? result.items : []
    }
  },
  {
    name: 'trending_news',
    description: 'Get top trending news data (default top 5).',
    schema: z.object({
      page: z.number().int().min(1).optional(),
      size: z.number().int().min(1).max(50).optional(),
      search: z.string().optional()
    })
  }
)
