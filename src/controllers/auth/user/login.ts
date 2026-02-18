import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import { generateAccessToken } from '../../../utilities/jwt'
import { handleServerError } from '../../../utilities/requestHandler'
import { UserModel } from '../../../models/userModel'
import logger from '../../../../logs'
import { hashPassword } from '../../../utilities/scurePassword'
import { type UserLoginInput } from '../../../schemas/auth/userAuthSchema'

export const userLogin = async (
  req: Request<{}, {}, UserLoginInput>,
  res: Response
): Promise<Response> => {
  const { userEmail, userPassword } = req.body

  try {
    const user = await UserModel.findOne({
      where: {
        deleted: 0,
        userEmail
      }
    })

    if (user == null) {
      const message = 'Account not found. Please register first!'
      logger.info(`Login attempt failed: ${message}`)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const isPasswordValid = hashPassword(userPassword) === user.userPassword
    if (!isPasswordValid) {
      const message = 'Invalid email numbuer and password combination!'
      logger.error(`Login attempt failed: ${message}`)
      return res.status(StatusCodes.UNAUTHORIZED).json(ResponseData.error({ message }))
    }

    const token = generateAccessToken({
      userId: user.userId,
      userRole: user.userRole,
      userEmail: user.userEmail
    })

    const payload = {
      accessToken: token,
      refreshToken: ''
    }

    logger.info(`User ${user.userName} logged in successfully`)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: payload }))
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
