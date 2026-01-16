import { Router } from 'express'
import { authController } from '../controllers/auth'

const router = Router()

router.post('/login/employees', authController.employeeLogin)
router.post('/register/employees', authController.employeeRegister)
router.post('/register/companies', authController.companyRegister)
router.post('/login/companies', authController.companyLogin)
router.post('/login/administrators', authController.administratorLogin)
router.patch('/reset-password', authController.updatePassword)

export default router
