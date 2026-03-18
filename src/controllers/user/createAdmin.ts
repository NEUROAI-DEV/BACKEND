import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UserService } from '../../services/UserService'
import type { ICreateAdminUser } from '../../schemas/UserSchema'

export const createAdminUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const body = req.body as ICreateAdminUser
    const admin = await UserService.createAdminUser(body)

    const response = ResponseData.success({
      data: admin
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (error) {
    return handleError(res, error)
  }
}
