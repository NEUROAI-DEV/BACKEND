import { Op } from 'sequelize'
import { UserModel, type IUserCreationAttributes } from '../models/userModel'
import { Pagination } from '../utilities/pagination'
import {
  IFindAllUser,
  type ICreateAdminUser,
  type IUpdateAdminUser
} from '../schemas/UserSchema'
import { AppError } from '../utilities/errorHandler'
import { hashPassword } from '../utilities/scurePassword'
import { SubscriptionModel } from '../models/subscriptionModel'
import { SubscriptionPlanModel } from '../models/subscriptionPlanModel'

export class UserService {
  static async findAll(params: IFindAllUser) {
    const { page, size, search, pagination } = params

    const paginationInfo = new Pagination(page, size)

    const where: any = {
      deleted: 0,
      userRole: 'user'
    }

    if (search != null && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { userName: { [Op.like]: term } },
        { userEmail: { [Op.like]: term } }
      ]
    }

    const result = await UserModel.findAndCountAll({
      attributes: { exclude: ['userPassword'] },
      where,
      include: [
        {
          model: SubscriptionModel,
          as: 'subscription',
          include: [{ model: SubscriptionPlanModel, as: 'subscriptionPlan' }]
        }
      ],
      order: [['userId', 'ASC']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    return paginationInfo.formatData(result)
  }

  static async findAllAdmin(params: IFindAllUser) {
    const { page, size, search, pagination } = params

    const paginationInfo = new Pagination(page, size)

    const where: any = {
      deleted: 0,
      userRole: 'admin'
    }

    if (search != null && String(search).trim() !== '') {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { userName: { [Op.like]: term } },
        { userEmail: { [Op.like]: term } }
      ]
    }

    const result = await UserModel.findAndCountAll({
      attributes: { exclude: ['userPassword'] },
      where,
      order: [['userId', 'ASC']],
      ...(pagination === true && {
        limit: paginationInfo.limit,
        offset: paginationInfo.offset
      })
    })

    return paginationInfo.formatData(result)
  }

  static async createAdminUser(payload: ICreateAdminUser) {
    const existing = await UserModel.findOne({
      where: { deleted: 0, userEmail: payload.userEmail, userRole: 'admin' }
    })

    if (existing) {
      throw AppError.badRequest(`Admin with email ${payload.userEmail} already exists`)
    }

    const data: IUserCreationAttributes = {
      userName: payload.userName,
      userEmail: payload.userEmail,
      userPassword: hashPassword(payload.userPassword),
      userRole: 'admin',
      userOnboardingStatus: 'completed'
    }

    const created = await UserModel.create(data)
    const plain = created.get({ plain: true }) as Omit<
      IUserCreationAttributes,
      'userPassword'
    > & {
      userId: number
    }
    // Password should never be returned
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userPassword, ...safe } = plain as any
    return safe
  }

  static async updateAdminUser(payload: IUpdateAdminUser) {
    const { userId, userName, userEmail, userPassword } = payload

    const user = await UserModel.findOne({
      where: { deleted: 0, userId, userRole: 'admin' }
    })

    if (!user) {
      throw AppError.notFound('Admin user not found')
    }

    const updated: Partial<IUserCreationAttributes> = {}

    if (userName != null) {
      updated.userName = userName
    }
    if (userEmail != null) {
      // ensure no other admin with same email
      const emailExists = await UserModel.findOne({
        where: {
          deleted: 0,
          userEmail,
          userRole: 'admin',
          userId: { [Op.ne]: userId }
        }
      })
      if (emailExists) {
        throw AppError.badRequest(`Admin with email ${userEmail} already exists`)
      }
      updated.userEmail = userEmail
    }
    if (userPassword != null) {
      updated.userPassword = hashPassword(userPassword)
    }

    await user.update(updated)
    const plain = user.get({ plain: true }) as any
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userPassword: _pw, ...safe } = plain
    return safe
  }

  static async removeAdminUser(userId: number): Promise<void> {
    const user = await UserModel.findOne({
      where: { deleted: 0, userId, userRole: 'admin' }
    })

    if (!user) {
      throw AppError.notFound('Admin user not found')
    }

    await user.destroy()
  }
}
