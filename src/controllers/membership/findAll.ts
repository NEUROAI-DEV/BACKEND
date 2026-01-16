import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { Pagination } from '../../utilities/pagination'
import { Op } from 'sequelize'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { membershipFindAllSchema } from '../../schemas/membershipSchema'
import { IMembershipFindAllRequest } from '../../interfaces/membership/membership.request'
import { MembershipModel } from '../../models/membershipModel'
import { UserModel } from '../../models/userModel'

export const findAllMembership = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    membershipFindAllSchema,
    req.query
  ) as {
    error: ValidationError
    value: IMembershipFindAllRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const { page: queryPage, size: querySize, pagination, search } = validatedData

    const page = new Pagination(Number(queryPage) || 0, Number(querySize) || 10)

    const result = await MembershipModel.findAndCountAll({
      where: {
        deleted: 0,
        ...(Boolean(req?.jwtPayload?.userRole === 'user') && {
          membershipUserId: req?.jwtPayload?.userId
        }),
        ...(Boolean(req?.jwtPayload?.userRole === 'admin') && {
          membershipCompanyId: req?.membershipPayload?.membershipCompanyId!
        }),
        ...(Boolean(search) && {
          [Op.or]: [{ membershipId: { [Op.like]: `%${search}%` } }]
        })
      },
      attributes: [
        'membershipId',
        'membershipCompanyId',
        'membershipUserId',
        'membershipOfficeId',
        'membershipStatus'
      ],
      include: [
        {
          model: UserModel,
          where: { userRole: 'user' },
          as: 'employee',
          attributes: ['userId', 'userName', 'userRole', 'userWhatsappNumber']
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

    logger.info('Membership retrieved successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
