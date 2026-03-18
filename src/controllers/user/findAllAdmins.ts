import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UserService } from '../../services/UserService'
import { IFindAllUser } from '../../schemas/UserSchema'

export const findAllAdmins = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllUser

    const result = await UserService.findAllAdmin(query)

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
