import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UserService } from '../../services/UserService'
import type { IUpdateAdminUser } from '../../schemas/UserSchema'

export const updateAdminUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as IUpdateAdminUser
    const admin = await UserService.updateAdminUser(body)

    const response = ResponseData.success({
      data: admin
    })

    return res.status(StatusCodes.OK).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
