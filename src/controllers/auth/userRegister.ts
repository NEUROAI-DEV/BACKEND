import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/requestHandler'
import { AuthService } from '../../services/AuthService'
import { IUserRegistration } from '../../schemas/AuthSchema'

export const userRegister = async (req: Request, res: Response): Promise<Response> => {
  try {
    const params = req.body as unknown as IUserRegistration
    await AuthService.registerUser(params)

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseData.success({ message: 'Registration successful' }))
  } catch (error) {
    return handleError(res, error)
  }
}
