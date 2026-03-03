import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { AuthService } from '../../services/AuthService'
import { IAdminLogin } from '../../schemas/AuthSchema'

export const administratorLogin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const params = req.body as unknown as IAdminLogin
    const payload = await AuthService.loginAdmin(params)

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: payload }))
  } catch (error) {
    return handleError(res, error)
  }
}
