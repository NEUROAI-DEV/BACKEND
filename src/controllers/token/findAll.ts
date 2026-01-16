import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { findAllEmployeeSchema } from '../../schemas/employeeSchema'
import { ValidationError } from 'joi'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { Pagination } from '../../utilities/pagination'
import { UserModel } from '../../models/userModel'
import logger from '../../logs'
import { ResponseData } from '../../utilities/response'
import { IEmployeeFindAllRequest } from '../../interfaces/employee/employee.request'
import { MembershipModel } from '../../models/membershipModel'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllEmployee = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllEmployeeSchema,
    req.query
  ) as {
    error: ValidationError
    value: IEmployeeFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { page: queryPage, size: querySize, search, pagination } = validatedData

  try {
    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await MembershipModel.findAndCountAll({
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
          where: {
            deleted: 0,
            ...(Boolean(search) && {
              [Op.or]: [{ userName: { [Op.like]: `%${search}%` } }]
            })
          },
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
      ],

      order: [['membershipId', 'desc']],
      ...(pagination === true && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = ResponseData.success({ data: result })
    response.data = page.formatData(result)

    logger.info('Fetched all employee successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
