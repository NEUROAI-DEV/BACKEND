import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { verifyOtpSchema } from '../../schemas/otpSchema'
import {
  handleServerError,
  handleValidationError,
  validateRequest
} from '../../utilities/requestHandler'
import { ValidationError } from 'joi'
import redis from '../../configs/redis'
import { IotpVerify } from '../../interfaces/otp/otp.request'

export const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
  const { error: validationError, value: validatedData } = validateRequest(
    verifyOtpSchema,
    req.body
  ) as {
    error: ValidationError
    value: IotpVerify
  }

  if (validationError) return handleValidationError(res, validationError)

  try {
    const storedOtp = await redis.get(`otp:${validatedData.otpCode}`)

    if (!storedOtp || storedOtp !== validatedData.otpCode) {
      const message = 'Invalid or expired OTP!'
      return res.status(StatusCodes.UNAUTHORIZED).json(ResponseData.error({ message }))
    }

    await redis.del(`otp:${validatedData.otpCode}`)
    const response = ResponseData.success({})

    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleServerError(res, serverError)
  }
}
