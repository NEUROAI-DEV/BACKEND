import { Op } from 'sequelize'
import { UserModel } from '../../models/userModel'

export interface FindAllUsersParams {
  page: number
  limit: number
  search?: string | null
}

export class UserService {
  static async findAll(params: FindAllUsersParams) {
    const { page, limit, search } = params

    const where: any = {
      deleted: 0
    }

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`
      where[Op.or] = [
        { userName: { [Op.like]: term } },
        { userEmail: { [Op.like]: term } }
      ]
    }

    const { count, rows } = await UserModel.findAndCountAll({
      attributes: { exclude: ['userPassword'] },
      where,
      order: [['userId', 'ASC']],
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
