import { Op } from 'sequelize'
import { ScreenerModel } from '../../models/screenerModel'

const MAX_SCREENERS_PER_USER = 10

export interface CreateScreenerParams {
  screenerUserId: number
  screenerCoinSymbol: string
  screenerProfile: 'SCALPING' | 'SWING' | 'INVEST'
}

export interface FindAllScreenerParams {
  screenerUserId: number
  page: number
  limit: number
  search?: string
}

export class ScreenerService {
  static async create(params: CreateScreenerParams) {
    const { screenerUserId, screenerCoinSymbol, screenerProfile } = params

    const count = await ScreenerModel.count({
      where: { screenerUserId }
    })

    if (count >= MAX_SCREENERS_PER_USER) {
      const error = new Error('Maximum 10 screeners per user.')
      ;(error as any).statusCode = 400
      throw error
    }

    const record = await ScreenerModel.create({
      screenerUserId,
      screenerCoinSymbol,
      screenerProfile
    })

    return record
  }

  static async findAll(params: FindAllScreenerParams) {
    const { screenerUserId, page, limit, search } = params

    const where: any = { screenerUserId }

    if (search && String(search).trim()) {
      where.screenerCoinSymbol = {
        [Op.like]: `%${String(search).trim()}%`
      }
    }

    const { count, rows } = await ScreenerModel.findAndCountAll({
      where,
      order: [['screenerId', 'DESC']],
      limit,
      offset: (page - 1) * limit
    })

    const totalPages = Math.ceil(count / limit) || 1

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    }
  }
}
