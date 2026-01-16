import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { updateEmployeeSchema } from '../../schemas/employeeSchema'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import { IEmployeeUpdateRequest } from '../../interfaces/employee/employee.request'
import { UserModel } from '../../models/userModel'
import logger from '../../logs'
import { type IAuthenticatedRequest } from '../../interfaces/shared/request.interface'

export const updateEmployee = async (
  req: IAuthenticatedRequest,
  res: Response
): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    updateEmployeeSchema,
    req.body
  ) as {
    error: ValidationError
    value: IEmployeeUpdateRequest
  }

  if (validationError) return handleValidationError(res, validationError)

  const { userId, userWhatsappNumber, userDeviceId } = validatedData

  try {
    const user = await UserModel.findOne({
      where: {
        deleted: 0,
        userId: userId
      }
    })

    if (user == null) {
      const message = 'Employee not found!'
      logger.info(message)
      return res.status(StatusCodes.NOT_FOUND).json(ResponseData.error({ message }))
    }

    const updatedData: Partial<IEmployeeUpdateRequest> = {
      ...(userWhatsappNumber?.length > 0 && { userWhatsappNumber }),
      ...(userDeviceId?.length > 0 && { userDeviceId })
    }

    await UserModel.update(updatedData, {
      where: {
        deleted: 0,
        userId: userId
      }
    })

    logger.info(`Employee ${userId} updated successfully`)
    return res
      .status(StatusCodes.OK)
      .json(ResponseData.success({ message: 'Employee updated successfully' }))
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
