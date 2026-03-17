import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from '../../utilities/response'
import { IVerifyOtp } from '../../schemas/otpSchema'
import { handleError } from '../../utilities/errorHandler'
import { OtpService } from '../../services/OtpService'

export const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
  const { userEmail, otpCode } = req.body as IVerifyOtp

  try {
    await OtpService.verifyOtp({ userEmail, otpCode })
    const response = ResponseData.success({
      message: 'OTP verified successfully'
    })

    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
