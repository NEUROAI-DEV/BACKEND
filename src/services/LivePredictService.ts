import { Op } from 'sequelize'
import {
  LivePredictModel,
  type ILivePredictAttributes,
  type ILivePredictCreationAttributes
} from '../models/livePredictModel'
import { AppError } from '../utilities/errorHandler'

export class LivePredictService {
  static async create(
    payload: ILivePredictCreationAttributes
  ): Promise<ILivePredictAttributes> {
    const created = await LivePredictModel.create(payload)
    return created.get({ plain: true }) as ILivePredictAttributes
  }

  static async findAll(params: {
    page?: number
    size?: number
    livePredictUserId?: number
  }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

    const where: { deleted: { [Op.eq]: number }; livePredictUserId?: number } = {
      deleted: { [Op.eq]: 0 }
    }

    if (params.livePredictUserId != null) {
      where.livePredictUserId = params.livePredictUserId
    }

    const { rows, count } = await LivePredictModel.findAndCountAll({
      where,
      order: [['livePredictId', 'DESC']],
      limit: size,
      offset
    })

    return {
      items: rows.map((row) => row.get({ plain: true }) as ILivePredictAttributes),
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
  }

  static async findDetail(livePredictId: number): Promise<ILivePredictAttributes> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    return row.get({ plain: true }) as ILivePredictAttributes
  }

  static async update(
    livePredictId: number,
    payload: Partial<Pick<ILivePredictCreationAttributes, 'livePredictSymbols'>>
  ): Promise<ILivePredictAttributes> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    await row.update(payload)
    return row.get({ plain: true }) as ILivePredictAttributes
  }

  static async remove(livePredictId: number): Promise<void> {
    const row = await LivePredictModel.findOne({
      where: { livePredictId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Live predict tidak ditemukan')
    }

    await row.destroy()
  }
}
