import { Router } from 'express'
import { authController } from '../controllers/auth'

const router = Router()

router.post('/login/users', authController.userLogin)
router.post('/register/users', authController.userRegister)

router.post('/login/administrators', authController.administratorLogin)
router.patch('/reset-password', authController.updatePassword)

export default router
