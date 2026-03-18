import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UserService } from '../../services/UserService'
import type { IRemoveAdminUser } from '../../schemas/UserSchema'

export const removeAdminUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.params as unknown as IRemoveAdminUser
    await UserService.removeAdminUser(params.userId)

    const response = ResponseData.success({
      data: null
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
