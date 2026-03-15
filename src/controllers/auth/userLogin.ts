import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { AuthService } from '../../services/AuthService'
import { IUserLogin } from '../../schemas/AuthSchema'

export const userLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.body as unknown as IUserLogin
    const payload = await AuthService.loginUser(params)
    return res.status(StatusCodes.OK).json(ResponseData.success({ data: payload }))
  } catch (error) {
    return handleError(res, error)
  }
}
