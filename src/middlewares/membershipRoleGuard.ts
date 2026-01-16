import { type RequestHandler } from 'express'
import { type IAuthenticatedRequest } from '../interfaces/shared/request.interface'
import { MembershipModel } from '../models/membershipModel'
import { ResponseData } from '../utilities/response'
import { StatusCodes } from 'http-status-codes'
import { handleServerError } from '../utilities/requestHandler'

export type MembershipRole = 'company' | 'employee'

export function allowMembershipRoles(...allowedRoles: MembershipRole[]): RequestHandler {
  return async (req: IAuthenticatedRequest, res, next) => {
    const companyId = parseInt(req.headers['x-company-id'] as string, 10)

    if (!req.jwtPayload || isNaN(companyId)) {
      const message = 'Unauthorized or missing company ID'
      const response = ResponseData.error({ message })

      return res.status(StatusCodes.UNAUTHORIZED).json(response)
    }

    try {
      const membership = await MembershipModel.findOne({
        where: {
          membershipUserId: req.jwtPayload?.userId,
          membershipCompanyId: companyId,
          membershipStatus: 'active'
        }
      })

      if (!membership) {
        const message = 'You are not a member of this company'
        const response = ResponseData.error({ message })

        return res.status(StatusCodes.UNAUTHORIZED).json(response)
      }

      if (!allowedRoles.includes(membership.membershipRole)) {
        const message = 'Forbidden: Insufficient role'
        const response = ResponseData.error({ message })

        return res.status(StatusCodes.UNAUTHORIZED).json(response)
      }

      req.membershipPayload = membership.dataValues
      next()
    } catch (serverError) {
      return handleServerError(res, serverError)
    }
  }
}
