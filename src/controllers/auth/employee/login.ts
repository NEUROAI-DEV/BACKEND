import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import { generateAccessToken } from '../../../utilities/jwt'
import { ValidationError } from 'joi'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../../utilities/requestHandler'
import { UserModel } from '../../../models/userModel'
import logger from '../../../logs'
import { hashPassword } from '../../../utilities/scurePassword'
import { IEmployeeLoginRequest } from '../../../interfaces/auth/employeeAuth.request'
import { employeeLoginSchema } from '../../../schemas/auth/employeeAuthSchema'
import { MembershipModel } from '../../../models/membershipModel'

export const employeeLogin = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    employeeLoginSchema,
    req.body
  ) as {
    error: ValidationError
    value: IEmployeeLoginRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { userWhatsappNumber, userPassword } = validatedData

  try {
    const user = await UserModel.findOne({
      where: {
        deleted: 0,
        userWhatsappNumber
      }
    })

    if (user == null) {
      const message = 'Account not found. Please register first!'
      logger.info(`Login attempt failed: ${message}`)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    // if (user?.userRole === 'user' && user.userDeviceId !== validatedData?.userDeviceId) {
    //   const message =
    //     'Gagal Login! Pastikan anda login dengan device yang sama saat anda melakukan registrasi'
    //   logger.info(`Login attempt failed: ${message}`)
    //   return res.status(StatusCodes.UNAUTHORIZED).json(ResponseData.error({ message }))
    // }

    const membership = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipStatus: 'active',
        membershipUserId: user.userId
      }
    })

    if (membership == null) {
      const message = 'Membership not found!'
      logger.info(`Login attempt failed: ${message}`)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const isPasswordValid = hashPassword(userPassword) === user.userPassword
    if (!isPasswordValid) {
      const message = 'Invalid whatsapp numbuer and password combination!'
      logger.error(`Login attempt failed: ${message}`)
      return res.status(StatusCodes.UNAUTHORIZED).json(ResponseData.error({ message }))
    }

    const token = generateAccessToken({ userId: user.userId, userRole: user.userRole })

    const payload = {
      accessToken: token,
      refreshToken: '',
      companyId: membership.membershipCompanyId
    }

    logger.info(`User ${user.userName} logged in successfully`)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: payload }))
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
