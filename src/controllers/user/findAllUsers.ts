import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { type FindAllUsersInput } from '../../schemas/UserSchema'
import { UserService } from '../../services/UserService'

export const findAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.query as unknown as FindAllUsersInput
    const { page, size, search, pagination } = query

    const result = await UserService.findAll({
      page,
      size,
      pagination: pagination ? 'true' : 'false',
      search
    })

    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ data: result.formatted }))
  } catch (error) {
    return handleError(res, error)
  }
}
