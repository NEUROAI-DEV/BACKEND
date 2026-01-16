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
import { MembershipModel } from '../../../models/membershipModel'
import { IMembershipAttributes } from '../../../interfaces/membership/membership.dto'
import { sequelize } from '../../../database/config'
import { IEmployeeRegisterRequest } from '../../../interfaces/auth/employeeAuth.request'
import { employeeRegistrationSchema } from '../../../schemas/auth/employeeAuthSchema'
import { CompanyModel } from '../../../models/companyModel'

export const employeeRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    employeeRegistrationSchema,
    req.body
  ) as {
    error: ValidationError
    value: IEmployeeRegisterRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const transaction = await sequelize.transaction()

  try {
    const companyInvitationCodeCheck = await CompanyModel.findOne({
      where: {
        deleted: 0,
        companyInviteCode: validatedData.userInvitationCode
      },
      transaction
    })

    if (companyInvitationCodeCheck == null) {
      await transaction.rollback()
      const message = `Kode invitation ${validatedData.userInvitationCode} tidak ditemukan`
      logger.info(`invitation code attempt failed: ${message}`)
      return res.status(StatusCodes.BAD_REQUEST).json(ResponseData.error({ message }))
    }

    const existingUser = await UserModel.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        userWhatsappNumber: { [Op.eq]: validatedData.userWhatsappNumber }
      },
      transaction
    })

    if (existingUser != null) {
      await transaction.rollback()
      const message = `Nomor Whatsapp ${existingUser.userWhatsappNumber} sudah terdaftar, gunakan yang lain`
      logger.info(`Registration attempt failed: ${message}`)
      return res.status(StatusCodes.BAD_REQUEST).json(ResponseData.error({ message }))
    }

    validatedData.userPassword = hashPassword(validatedData.userPassword)
    validatedData.userRole = 'user'

    const createdUser = await UserModel.create(validatedData, { transaction })

    const membershipPayload = {
      membershipUserId: createdUser.userId,
      membershipCompanyId: companyInvitationCodeCheck.companyId,
      membershipRole: 'employee',
      membershipStatus: 'active'
    } as IMembershipAttributes

    await MembershipModel.create(membershipPayload, { transaction })

    await transaction.commit()

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseData.success({ message: 'Registration successful' }))
  } catch (serverError) {
    await transaction.rollback()
    return handleServerError(res, serverError)
  }
}
