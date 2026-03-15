import { Op } from 'sequelize'
import { isAddress } from 'ethers'
import {
  SmartWalletModel,
  type ISmartWalletAttributes,
  type ISmartWalletCreationAttributes
} from '../models/smartWalletModel'
import { AppError } from '../utilities/errorHandler'
import { SmartWalletTrackerModel } from '../models/smartWalletTrackerModel'

export class SmartWalletService {
  static async create(
    payload: ISmartWalletCreationAttributes
  ): Promise<ISmartWalletAttributes> {
    const address = payload.smartWalletAddress?.trim()
    if (!address || !isAddress(address)) {
      throw AppError.badRequest(
        'Smart wallet address is not valid (not a valid Ethereum address)'
      )
    }

    const created = await SmartWalletModel.create(payload)
    return created.get({ plain: true }) as ISmartWalletAttributes
  }

  static async findAll(params: { page?: number; size?: number; search?: string }) {
    const page = params.page && params.page > 0 ? params.page : 1
    const size = params.size && params.size > 0 ? params.size : 10
    const offset = (page - 1) * size

    const term = params.search?.trim()
    const where =
      term != null && term !== ''
        ? {
            deleted: 0,
            [Op.or]: [
              { smartWalletAddress: { [Op.like]: `%${term}%` } },
              { smartWalletName: { [Op.like]: `%${term}%` } }
            ]
          }
        : { deleted: 0 }

    const { rows, count } = await SmartWalletModel.findAndCountAll({
      where,
      order: [['smartWalletId', 'ASC']],
      include: [
        {
          model: SmartWalletTrackerModel,
          as: 'smartWalletTrackers'
        }
      ],
      distinct: true,
      limit: size,
      offset
    })

    return {
      items: rows.map((row) => row.get({ plain: true }) as ISmartWalletAttributes),
      totalItems: count,
      page,
      size,
      totalPages: Math.ceil(count / size)
    }
  }

  static async findDetail(smartWalletId: number): Promise<ISmartWalletAttributes> {
    const row = await SmartWalletModel.findOne({
      where: { smartWalletId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Smart wallet tidak ditemukan')
    }

    return row.get({ plain: true }) as ISmartWalletAttributes
  }

  static async update(
    smartWalletId: number,
    payload: Partial<Omit<ISmartWalletCreationAttributes, 'smartWalletId'>>
  ): Promise<ISmartWalletAttributes> {
    const row = await SmartWalletModel.findOne({
      where: { smartWalletId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Smart wallet tidak ditemukan')
    }

    await row.update(payload)
    return row.get({ plain: true }) as ISmartWalletAttributes
  }

  static async remove(smartWalletId: number): Promise<void> {
    const row = await SmartWalletModel.findOne({
      where: { smartWalletId, deleted: 0 }
    })

    if (row == null) {
      throw AppError.notFound('Smart wallet tidak ditemukan')
    }

    await row.destroy()
  }
}
