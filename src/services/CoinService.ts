import { Op } from 'sequelize'
import {
  CoinModel,
  type ICoinAttributes,
  type ICoinCreationAttributes
} from '../models/coinModel'
import { AppError } from '../utilities/errorHandler'

export class CoinService {
  static async create(payload: ICoinCreationAttributes): Promise<ICoinAttributes> {
    const created = await CoinModel.create(payload)
    return created.get({ plain: true }) as ICoinAttributes
  }

  static async findAll(params: { page?: number; size?: number; search?: string }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

    const term = params.search?.trim()
    const where = term
      ? {
          deleted: 0,
          [Op.or]: [
            { coinName: { [Op.like]: `%${term}%` } },
            { coinSymbol: { [Op.like]: `%${term}%` } }
          ]
        }
      : { deleted: 0 }

    const { rows, count } = await CoinModel.findAndCountAll({
      where,
      order: [['coinId', 'ASC']],
      limit: size,
      offset
    })

    return {
      items: rows.map((row) => row.get({ plain: true }) as ICoinAttributes),
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
  }

  static async findDetail(coinId: number): Promise<ICoinAttributes> {
    const row = await CoinModel.findOne({
      where: { coinId, deleted: 0 }
    })
    if (row == null) {
      throw AppError.notFound('Coin tidak ditemukan')
    }
    return row.get({ plain: true }) as ICoinAttributes
  }

  static async update(
    coinId: number,
    payload: Partial<Omit<ICoinCreationAttributes, 'coinId'>>
  ): Promise<ICoinAttributes> {
    const row = await CoinModel.findOne({
      where: { coinId, deleted: 0 }
    })
    if (row == null) {
      throw AppError.notFound('Coin tidak ditemukan')
    }
    await row.update(payload)
    return row.get({ plain: true }) as ICoinAttributes
  }

  static async remove(coinId: number): Promise<void> {
    const row = await CoinModel.findOne({
      where: { coinId, deleted: 0 }
    })
    if (row == null) {
      throw AppError.notFound('Coin tidak ditemukan')
    }
    await row.destroy()
  }
}
