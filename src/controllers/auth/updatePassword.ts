import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type IAdminUpdate } from '../../schemas/AuthSchema'
import { AuthService } from '../../services/auth'

export const updatePassword = async (
  req: Request<{}, {}, IAdminUpdate>,
  res: Response
): Promise<Response> => {
  try {
    await AuthService.updateUserPassword(req.body)

    const response = ResponseData.success({ message: 'Password updated successfully' })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
