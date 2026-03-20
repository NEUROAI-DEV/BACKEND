import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IRequestOtp } from '../../schemas/otpSchema'
import { ResponseData } from '../../utilities/response'
import { handleError } from '../../utilities/errorHandler'
import { OtpService } from '../../services/OtpService'

export const requestOtp = async (req: Request, res: Response): Promise<Response> => {
  const { userEmail, otpType } = req.body as IRequestOtp

  try {
    await OtpService.requestOtp({ userEmail, otpType })

    const response = ResponseData.success({
      message: 'OTP sent successfully'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
