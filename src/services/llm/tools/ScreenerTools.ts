import { tool } from 'langchain'
import * as z from 'zod'
import { ScreenerService, type ScreenerCategory } from '../../ScreenerService'

type ToolResult = {
  category: ScreenerCategory
  totalItems: number
  items: unknown[]
}

export const screenerByCategoryTool = tool(
  async ({ category, page = 1, size = 5, search = '' }): Promise<ToolResult> => {
    const result = await ScreenerService.getByCategory({
      category,
      page,
      size,
      search
    })

    return {
      category,
      totalItems: result.totalItems ?? 0,
      items: Array.isArray(result.items) ? result.items : []
    }
  },
  {
    name: 'screener_by_category',
    description:
      'Get coin screener data by category. Categories: trending, gainers, losers, markets.',
    schema: z.object({
      category: z.enum(['trending', 'gainers', 'losers', 'markets']),
      page: z.number().int().min(1).optional(),
      size: z.number().int().min(1).max(50).optional(),
      search: z.string().optional()
    })
  }
)
