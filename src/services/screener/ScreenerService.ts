import { Op } from 'sequelize'
import { ScreenerModel } from '../../models/screenerModel'

const MAX_SCREENERS_PER_USER = 5

export interface CreateScreenerParams {
  screenerUserId: number
  screenerCoinSymbol: string
  screenerProfile: 'SCALPING' | 'SWING' | 'INVEST'
  screenerCoinImage: string
}

export interface FindAllScreenerParams {
  screenerUserId: number
  page: number
  limit: number
  search?: string
}

export class ScreenerService {
  static async create(params: CreateScreenerParams) {
    const { screenerUserId, screenerCoinSymbol, screenerProfile, screenerCoinImage } =
      params

    const existingScreener = await ScreenerModel.findOne({
      where: { screenerUserId, screenerCoinSymbol }
    })

    if (existingScreener) {
      const error = new Error('Screener already exists.')
      ;(error as any).statusCode = 400
      throw error
    }

    const count = await ScreenerModel.count({
      where: { screenerUserId }
    })

    if (count >= MAX_SCREENERS_PER_USER) {
      const error = new Error('Maximum 5 screeners per user.')
      ;(error as any).statusCode = 400
      throw error
    }

    const record = await ScreenerModel.create({
      screenerUserId,
      screenerCoinSymbol,
      screenerProfile,
      screenerCoinImage
    })

    return record
  }

  static async findAll(params: FindAllScreenerParams) {
    const { screenerUserId, page, limit, search } = params

    const where: any = { deleted: 0, screenerUserId }

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
