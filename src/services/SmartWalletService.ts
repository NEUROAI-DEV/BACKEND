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
import logger from '../utilities/logger'
import { StatusCodes } from 'http-status-codes'

export class SmartWalletService {
  static async create(
    payload: ISmartWalletCreationAttributes
  ): Promise<ISmartWalletAttributes> {
    try {
      const address = payload.smartWalletAddress?.trim()
      if (!address || !isAddress(address)) {
        throw AppError.badRequest(
          'Smart wallet address is not valid (not a valid Ethereum address)'
        )
      }

      const existing = await SmartWalletModel.findOne({
        where: { smartWalletAddress: address }
      })

      if (existing) {
        throw AppError.badRequest('Smart wallet address already exists')
      }

      const created = await SmartWalletModel.create(payload)
      return created.get({ plain: true }) as ISmartWalletAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SmartWalletService] create failed: ${String(error)}`)
      throw new AppError(
        'Failed to create smart wallet',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findAll(params: IFindAllSmartWallet) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SmartWalletService] findAll failed: ${String(error)}`)
      throw new AppError(
        'Failed to find all smart wallets',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findAllSmartWalletsAdmin(params: IFindAllSmartWallet) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(
        `[SmartWalletService] findAllSmartWalletsAdmin failed: ${String(error)}`
      )
      throw new AppError(
        'Failed to find all smart wallets admin',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async findDetail(smartWalletId: number): Promise<ISmartWalletAttributes> {
    try {
      const row = await SmartWalletModel.findOne({
        where: { smartWalletId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Smart wallet tidak ditemukan')
      }

      return row.get({ plain: true }) as ISmartWalletAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SmartWalletService] findDetail failed: ${String(error)}`)
      throw new AppError(
        'Failed to find smart wallet detail',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async update(
    smartWalletId: number,
    payload: Partial<Omit<ISmartWalletCreationAttributes, 'smartWalletId'>>
  ): Promise<ISmartWalletAttributes> {
    try {
      const row = await SmartWalletModel.findOne({
        where: { smartWalletId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Smart wallet tidak ditemukan')
      }

      await row.update(payload)
      return row.get({ plain: true }) as ISmartWalletAttributes
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SmartWalletService] update failed: ${String(error)}`)
      throw new AppError(
        'Failed to update smart wallet',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  static async remove(smartWalletId: number): Promise<void> {
    try {
      const row = await SmartWalletModel.findOne({
        where: { smartWalletId, deleted: 0 }
      })

      if (row == null) {
        throw AppError.notFound('Smart wallet tidak ditemukan')
      }

      await row.destroy()
    } catch (error) {
      if (error instanceof AppError) throw error
      logger.error(`[SmartWalletService] remove failed: ${String(error)}`)
      throw new AppError(
        'Failed to remove smart wallet',
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}
