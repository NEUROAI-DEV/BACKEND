import { Op } from 'sequelize'
import logger from '../../logs'
import redis from '../configs/redis'
import { appConfigs } from '../configs'
import { UserModel } from '../models/userModel'
import { AppError } from '../utilities/errorHandler'
import { Resend } from 'resend'

export type OtpType = 'register' | 'reset'

export class OtpService {
  private static resendClient(): Resend {
    return new Resend(appConfigs.resend.apiKey)
  }

  static async requestOtp(params: {
    userEmail: string
    otpType: OtpType
  }): Promise<{ otpCode: string; expiresInMinutes: number }> {
    const { userEmail, otpType } = params

    const existingUser = await UserModel.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        userEmail: { [Op.eq]: userEmail }
      }
    })

    if (otpType === 'reset' && existingUser === null) {
      throw AppError.badRequest(`email ${userEmail} is not registered.`)
    }

    if (otpType === 'register' && existingUser != null) {
      throw AppError.badRequest(`email ${userEmail} is already registered.`)
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const minutes = 5

    await redis.setex(`otp:${otpCode}`, minutes * 60, otpCode)

    const message =
      `${otpCode} is your verification code.\n\n` +
      `Security reminder: To ensure the security of your account, please do not share any information about your account with anyone. This code will expire in ${minutes} minutes`

    console.log(message)

    try {
      const resend = OtpService.resendClient()
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: userEmail,
        subject: 'NeuroAI - OTP Verification Code',
        html: message
      })
    } catch (e) {
      logger.error(e)
      throw e
    }

    return { otpCode, expiresInMinutes: minutes }
  }

  static async verifyOtp(params: { userEmail: string; otpCode: string }): Promise<void> {
    const { otpCode } = params

    const storedOtp = await redis.get(`otp:${otpCode}`)
    if (!storedOtp || storedOtp !== otpCode) {
      throw AppError.badRequest('Invalid or expired OTP!')
    }

    await redis.del(`otp:${otpCode}`)
  }
}
