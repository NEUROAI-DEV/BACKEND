import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import logger from '../../logs'
import { ValidationError } from 'joi'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'
import { membershipRemoveSchema } from '../../schemas/membershipSchema'
import { IMembershipRemoveRequest } from '../../interfaces/membership/membership.request'
import { MembershipModel } from '../../models/membershipModel'

export const removeMembership = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    membershipRemoveSchema,
    req.params
  ) as {
    error: ValidationError
    value: IMembershipRemoveRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const result = await MembershipModel.findOne({
      where: {
        deleted: 0,
        membershipCompanyId: req?.membershipPayload?.membershipCompanyId!,
        membershipId: validatedData.membershipId
      }
    })

    if (result == null) {
      const message = `Membership not found with ID: ${validatedData.membershipId}`
      logger.warn(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    result.deleted = true
    await result.save()

    const response = ResponseData.success({ message: 'Membership deleted successfully' })
    logger.info('Membership deleted successfully')
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
