import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { IMembershipUpdateRequest } from '../../interfaces/membership/membership.request'
import { membershipUpdateSchema } from '../../schemas/membershipSchema'
import { MembershipModel } from '../../models/membershipModel'

export const updateMembership = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    membershipUpdateSchema,
    req.body
  ) as {
    error: ValidationError
    value: IMembershipUpdateRequest
  }

  if (validationError) return handleValidationError(res, validationError)
  try {
    const membership = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId!,
        membershipId: validatedData.membershipId
      }
    })

    if (membership === null) {
      const message = `Membership not found with ID: ${validatedData.membershipId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    await MembershipModel.update(validatedData, {
      where: {
        deleted: 0,
        membershipId: validatedData.membershipId
      }
    })

    const response = ResponseData.success({ message: 'Membership updated successfully' })
    logger.info('Membership updated successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
