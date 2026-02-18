import { Router } from 'express'
import { authController } from '../controllers/auth'
import { validate } from '../middlewares/validate'
import {
  employeeRegistrationSchema,
  userLoginSchema,
  userUpdatePasswordSchema
} from '../schemas/auth/userAuthSchema'
import { adminLoginSchema } from '../schemas/auth/adminAuthSchema'

const AuthRoute = Router()

AuthRoute.post(
  '/login/users',
  validate({ body: userLoginSchema }),
  authController.userLogin
)

AuthRoute.post(
  '/register/users',
  validate({ body: employeeRegistrationSchema }),
  authController.userRegister
)

AuthRoute.post(
  '/login/administrators',
  validate({ body: adminLoginSchema }),
  authController.administratorLogin
)

AuthRoute.patch(
  '/reset-password',
  validate({ body: userUpdatePasswordSchema }),
  authController.updatePassword
)

export default AuthRoute
