import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { UserService } from '../../services/UserService'
import { IFindAllUser } from '../../schemas/UserSchema'
import { IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const findAllAdmins = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const query = req.query as unknown as IFindAllUser
    const user = req.jwtPayload?.userId as number

    const result = await UserService.findAllAdmin({ ...query, userId: user })

    return res.status(StatusCodes.OK).json(ResponseData.success({ data: result }))
  } catch (error) {
    return handleError(res, error)
  }
}
