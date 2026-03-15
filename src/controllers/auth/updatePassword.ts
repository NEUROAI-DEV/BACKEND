import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { AuthService } from '../../services/AuthService'
import { type IAdminUpdate } from '../../schemas/AuthSchema'

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.body as unknown as IAdminUpdate
    await AuthService.updateUserPassword(params)

    const response = ResponseData.success({ message: 'Password updated successfully' })
    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
