import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { BinanceService } from '../../services/external/BinanceService'
import { findUsdtSymbolsSchema } from '../../schemas/MarketSymbolsSchema'

export const findUsdtSymbols = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findUsdtSymbolsSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { search, page, limit } = validatedData

  try {
    const allSymbols = await BinanceService.getUsdtSymbols()

    let filtered = allSymbols
    if (search && String(search).trim()) {
      const term = String(search).trim().toLowerCase()
      filtered = allSymbols.filter(
        (s) =>
          s.symbol.toLowerCase().includes(term) ||
          s.baseAsset.toLowerCase().includes(term)
      )
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const start = (page - 1) * limit
    const items = filtered.slice(start, start + limit)

    const result = {
      items,
      totalItems: total,
      totalPages,
      currentPage: page
    }

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
