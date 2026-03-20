import { Router } from 'express'
import { MiddleWares } from '../middlewares'
import { requestOtpSchema, verifyOtpSchema } from '../schemas/otpSchema'
import { OtpController } from '../controllers/otp'

const OtpRoute = Router()

OtpRoute.post(
  '/request',
  MiddleWares.validate({ body: requestOtpSchema }),
  OtpController.requestOtp
)

OtpRoute.post(
  '/verify',
  MiddleWares.validate({ body: verifyOtpSchema }),
  OtpController.verifyOtp
)

export default OtpRoute
