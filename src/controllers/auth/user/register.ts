import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { ResponseData } from '../../../utilities/response'
import { handleServerError } from '../../../utilities/requestHandler'
import { UserModel } from '../../../models/userModel'
import logger from '../../../../logs'
import { hashPassword } from '../../../utilities/scurePassword'
import { sequelizeInit } from '../../../configs/database'
import { type EmployeeRegistrationInput } from '../../../schemas/auth/userAuthSchema'
import { type IUserCreationAttributes } from '../../../models/userModel'

export const userRegister = async (
  req: Request<{}, {}, EmployeeRegistrationInput>,
  res: Response
): Promise<Response> => {
  const validatedData: IUserCreationAttributes = {
    userName: req.body.userName ?? '',
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
    userRole: 'user',
    userOnboardingStatus: 'waiting',
    userSubscriptionStatus: 'inactive',
    userSubscriptionStartDate: new Date(),
    userSubscriptionEndDate: new Date(),
    userSubscriptionPlan: 'free'
  }

  const transaction = await sequelizeInit.transaction()

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
