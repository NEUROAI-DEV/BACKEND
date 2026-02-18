import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { ResponseData } from '../../utilities/response'
import { handleServerError } from '../../utilities/requestHandler'
import { IUserUpdateRequest } from '../../interfaces/user.request'
import { UserModel } from '../../models/userModel'
import logger from '../../../logs'
import { hashPassword } from '../../utilities/scurePassword'
import { type UserUpdatePasswordInput } from '../../schemas/auth/userAuthSchema'

export const updatePassword = async (
  req: Request<{}, {}, UserUpdatePasswordInput>,
  res: Response
): Promise<Response> => {
  const { userPassword, userEmail } = req.body

  try {
    const user = await UserModel.findOne({
      where: {
        deleted: 0,
        userEmail: userEmail,
        userRole: 'user'
      }
    })

    if (user == null) {
      const message = 'User not found!'
      logger.info('Attempt to update non-existing user')
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const updatedData: Partial<IUserUpdateRequest | any> = {
      ...(userPassword && { userPassword: hashPassword(userPassword) })
    }

    await UserModel.update(updatedData, {
      where: {
        deleted: { [Op.eq]: 0 },
        userId: { [Op.eq]: user.userId }
      }
    })

    logger.info('Password updated successfully')
    const response = ResponseData.success({ message: 'Password updated successfully' })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
