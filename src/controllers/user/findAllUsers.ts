import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { UserService } from '../../services/user/UserService'
import { findAllUsersSchema } from '../../schemas/userSchema'

export const findAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    findAllUsersSchema,
    req.query
  )

  if (validationError) return handleValidationError(res, validationError)

  const { page, limit } = validatedData

  try {
    const result = await UserService.findAll({ page, limit })

    const response = ResponseData.success({
      data: {
        items: result.items,
        totalItems: result.pagination.total,
        currentPage: result.pagination.page,
        totalPages: result.pagination.totalPages
      }
    })
    return res.status(StatusCodes.OK).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
