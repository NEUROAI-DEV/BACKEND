import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { ResponseData } from '../../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { UserModel } from '../../../models/userModel'
import logger from '../../../logs'
import { hashPassword } from '../../../utilities/scurePassword'

import { sequelize } from '../../../database/config'
import { employeeRegistrationSchema } from '../../../schemas/auth/userAuthSchema'
import { IUserRegisterRequest } from '../../../interfaces/auth/userAuth.request'

export const userRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    employeeRegistrationSchema,
    req.body
  ) as {
    error: ValidationError
    value: IUserRegisterRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const transaction = await sequelize.transaction()

  try {

    const existingUser = await UserModel.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        userEmail: { [Op.eq]: validatedData.userEmail }
      },
      transaction
    })

    if (existingUser != null) {
      await transaction.rollback()
      const message = `E-mail ${existingUser.userEmail} sudah terdaftar, gunakan yang lain`
      logger.info(`Registration attempt failed: ${message}`)
      return res.status(StatusCodes.BAD_REQUEST).json(ResponseData.error({ message }))
    }

    validatedData.userPassword = hashPassword(validatedData.userPassword)
    validatedData.userRole = 'user'

    await UserModel.create(validatedData, { transaction })

    await transaction.commit()

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseData.success({ message: 'Registration successful' }))
  } catch (serverError) {
    await transaction.rollback()
    return handleServerError(res, serverError)
  }
}
