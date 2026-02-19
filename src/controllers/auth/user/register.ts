import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../../utilities/response'
import { handleError } from '../../../utilities/requestHandler'
import { type EmployeeRegistrationInput } from '../../../schemas/auth/userAuthSchema'
import { AuthService } from '../../../services/auth'

export const userRegister = async (
  req: Request<{}, {}, EmployeeRegistrationInput>,
  res: Response
): Promise<Response> => {
  try {
    await AuthService.registerUser(req.body)

    return res
      .status(StatusCodes.CREATED)
      .json(ResponseData.success({ message: 'Registration successful' }))
  } catch (error) {
    return handleError(res, error)
  }
}
