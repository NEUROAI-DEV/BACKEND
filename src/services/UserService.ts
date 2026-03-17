import { Op } from 'sequelize'
import { UserModel } from '../models/userModel'
import { Pagination } from '../utilities/pagination'
import { IFindAllUser } from '../schemas/UserSchema'
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
}
