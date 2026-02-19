import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import { handleError } from '../../../utilities/requestHandler'
import { type AdminLoginInput } from '../../../schemas/auth/adminAuthSchema'
import { AuthService } from '../../../services/auth'

export const administratorLogin = async (
  req: Request<{}, {}, AdminLoginInput>,
  res: Response
): Promise<Response> => {
  try {
    const payload = await AuthService.loginAdmin(req.body)

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: payload }))
  } catch (error) {
    return handleError(res, error)
  }
}
