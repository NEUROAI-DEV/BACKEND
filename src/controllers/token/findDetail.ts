import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { findDetailEmployeeSchema } from '../../schemas/employeeSchema'
import { ValidationError } from 'joi'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { UserModel } from '../../models/userModel'
import { IEmployeeFindDetailRequest } from '../../interfaces/employee/employee.request'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { MembershipModel } from '../../models/membershipModel'
import { Op } from 'sequelize'

export const findDetailEmployee = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findDetailEmployeeSchema,
    req.params
  ) as {
    error: ValidationError
    value: IEmployeeFindDetailRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { employeeId } = validatedData

  try {
    const user = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId!,
        membershipRole: 'employee',
        ...(Boolean(req.body?.jwtPayload?.userRole === 'user') && {
          membershipUserId: { [Op.not]: req.body?.jwtPayload?.userId }
        })
      },
      include: [
        {
          model: UserModel,
          as: 'employee',
          attributes: [
            'userId',
            'userDeviceId',
            'userName',
            'userWhatsappNumber',
            'userRole',
            'createdAt',
            'updatedAt'
          ]
        }
      ]
    })

    if (user == null) {
      const message = 'Employee not found!'
      logger.info(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const response = ResponseData.success({ data: user })
    logger.info(`Fetched employee with ID: ${employeeId} successfully`)
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
