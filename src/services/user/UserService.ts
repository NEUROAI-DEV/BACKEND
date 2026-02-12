import { UserModel } from '../../models/userModel'

export interface FindAllUsersParams {
  page: number
  limit: number
}

export class UserService {
  static async findAll(params: FindAllUsersParams) {
    const { page, limit } = params

    const { count, rows } = await UserModel.findAndCountAll({
      attributes: { exclude: ['userPassword'] },
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
