import { Op } from 'sequelize'
import {
  TransactionModel,
  type ITransactionAttributes,
  type ITransactionCreationAttributes
} from '../models/transactionModel'
import { AppError } from '../utilities/errorHandler'

export class TransactionService {
  static async create(
    payload: ITransactionCreationAttributes
  ): Promise<ITransactionAttributes> {
    const created = await TransactionModel.create(payload)
    return created.get({ plain: true }) as ITransactionAttributes
  }

  static async findAll(params: {
    page?: number
    size?: number
    transactionUserId?: number
    transactionStatus?: string
  }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

    const where: any = {
      deleted: {
        [Op.eq]: 0
      }
    }

    if (params.transactionUserId != null) {
      where.transactionUserId = params.transactionUserId
    }

    if (params.transactionStatus != null) {
      where.transactionStatus = params.transactionStatus
    }

    const { rows, count } = await TransactionModel.findAndCountAll({
      where,
      order: [['transactionId', 'DESC']],
      limit: size,
      offset
    })

    return {
      items: rows.map((row) => row.get({ plain: true }) as ITransactionAttributes),
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
  }

  static async findDetail(transactionId: number): Promise<ITransactionAttributes> {
    const trx = await TransactionModel.findOne({
      where: { transactionId, deleted: 0 }
    })

    if (trx == null) {
      throw AppError.notFound('Transaction tidak ditemukan')
    }

    return trx.get({ plain: true }) as ITransactionAttributes
  }

  static async update(
    transactionId: number,
    payload: Partial<ITransactionCreationAttributes>
  ): Promise<ITransactionAttributes> {
    const trx = await TransactionModel.findOne({
      where: { transactionId, deleted: 0 }
    })

    if (trx == null) {
      throw AppError.notFound('Transaction tidak ditemukan')
    }

    await trx.update(payload)

    return trx.get({ plain: true }) as ITransactionAttributes
  }

  static async remove(transactionId: number): Promise<void> {
    const trx = await TransactionModel.findOne({
      where: { transactionId, deleted: 0 }
    })

    if (trx == null) {
      throw AppError.notFound('Transaction tidak ditemukan')
    }

    await trx.destroy()
  }
}
