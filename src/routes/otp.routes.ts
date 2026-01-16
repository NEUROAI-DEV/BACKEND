import { Router } from 'express'
import { otpController } from '../controllers/otp'

const router = Router()

router.post('/request', otpController.requestOtp)
router.post('/verify', otpController.verifyOtp)

export default router
