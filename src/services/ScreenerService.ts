import { Op } from 'sequelize'
import { StatusCodes } from 'http-status-codes'
import logger from '../../logs'
import { ScreenerModel } from '../models/screenerModel'
import { AppError } from '../utilities/errorHandler'

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

    if (existingScreener != null) {
      throw AppError.badRequest('Screener already exists.')
    }

    const count = await ScreenerModel.count({
      where: { screenerUserId }
    })

    if (count >= MAX_SCREENERS_PER_USER) {
      throw AppError.badRequest('Maximum 5 screeners per user.')
    }

    try {
      return await ScreenerModel.create({
        screenerUserId,
        screenerCoinSymbol,
        screenerProfile,
        screenerCoinImage: screenerCoinImage ?? ''
      })
    } catch (error) {
      logger.error(`[ScreenerService] create failed: ${String(error)}`)
      throw new AppError('Failed to create screener', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async findAll(params: FindAllScreenerParams) {
    try {
      const { screenerUserId, page, limit, search } = params

      const where: any = { deleted: 0, screenerUserId }

      if (search != null && String(search).trim() !== '') {
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
    } catch (error) {
      logger.error(`[ScreenerService] findAll failed: ${String(error)}`)
      throw new AppError('Failed to fetch screeners', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async remove(screenerId: number, screenerUserId: number) {
    const result = await ScreenerModel.findOne({
      where: {
        screenerId,
        screenerUserId
      }
    })

    if (result == null) {
      throw AppError.notFound(`Screener not found with ID: ${screenerId}`)
    }

    try {
      await result.destroy()
    } catch (error) {
      logger.error(`[ScreenerService] remove failed: ${String(error)}`)
      throw new AppError('Failed to delete screener', StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
