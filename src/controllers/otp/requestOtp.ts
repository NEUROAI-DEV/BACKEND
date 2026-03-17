import { type Request, type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Op } from 'sequelize'
import { IRequestOtp } from '../../schemas/OtpSchema'
import { UserModel } from '../../models/userModel'
import { ResponseData } from '../../utilities/response'
import logger from '../../../logs'
import redis from '../../configs/redis'
import { handleError } from '../../utilities/errorHandler'

import { Resend } from 'resend'
import { appConfigs } from '../../configs'

const resend = new Resend(appConfigs.resend.apiKey)

export const requestOtp = async (req: Request, res: Response): Promise<Response> => {
  const { userEmail, otpType } = req.body as IRequestOtp

  try {
    const existingUser = await UserModel.findOne({
      where: {
        deleted: { [Op.eq]: 0 },
        userEmail: { [Op.eq]: userEmail }
      }
    })

    if (otpType === 'reset' && existingUser === null) {
      const message = `email ${userEmail} is not registered.`
      logger.info(`Registration attempt failed: ${message}`)
      return res.status(StatusCodes.BAD_REQUEST).json(ResponseData.error({ message }))
    }

    if (otpType === 'register' && existingUser != null) {
      const message = `email ${userEmail} is already registered.`
      logger.info(`Registration attempt failed: ${message}`)
      return res.status(StatusCodes.BAD_REQUEST).json(ResponseData.error({ message }))
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const minutes = 5
    await redis.setex(`otp:${otpCode}`, minutes * 60, otpCode)

    const message = encodeURIComponent(
      `*${otpCode}* adalah kode verifikasi Anda.\n\n` +
        `Pengingat keamanan: Untuk memastikan keamanan akun Anda, mohon jangan bagikan informasi apa pun tentang akun Anda kepada siapa pun. kode ini akan expire dalam ${minutes} menit`
    )

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: userEmail,
        subject: 'Kode Verifikasi OTP',
        html: message
      })
    } catch (e) {
      logger.error(e)
      throw e
    }

    const response = ResponseData.success({})

    return res.status(StatusCodes.CREATED).json(response)
  } catch (serverError) {
    return handleError(res, serverError)
  }
}
