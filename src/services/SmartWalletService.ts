import { Op } from 'sequelize'
import { isAddress } from 'ethers'
import {
  SmartWalletModel,
  type ISmartWalletAttributes,
  type ISmartWalletCreationAttributes
} from '../models/smartWalletModel'
import { AppError } from '../utilities/errorHandler'
import { SmartWalletTrackerModel } from '../models/smartWalletTrackerModel'
import { Pagination } from '../utilities/pagination'
import { IFindAllSmartWallet } from '../schemas/SmartWalletSchema'

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

  static async findAll(params: IFindAllSmartWallet) {
    const { page = 1, size = 10, search, pagination } = params
    const paginationInfo = new Pagination(page, size)

    const where: any = {
      deleted: 0
    }

    if (search != null && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { smartWalletAddress: { [Op.like]: term } },
        { smartWalletName: { [Op.like]: term } }
      ]
    }

    const result = await SmartWalletModel.findAndCountAll({
      where,
      order: [['smartWalletId', 'ASC']],
      include: [
        {
          model: SmartWalletTrackerModel,
          as: 'smartWalletTrackers'
        }
      ],
      distinct: true,
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    return paginationInfo.formatData(result)
  }

  static async findAllSmartWalletsAdmin(params: IFindAllSmartWallet) {
    const { page = 1, size = 10, search, pagination } = params
    const paginationInfo = new Pagination(page, size)

    const where: any = {
      deleted: 0
    }

    if (search != null && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { smartWalletAddress: { [Op.like]: term } },
        { smartWalletName: { [Op.like]: term } }
      ]
    }

    const result = await SmartWalletModel.findAndCountAll({
      where,
      order: [['smartWalletId', 'ASC']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    return paginationInfo.formatData(result)
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
