import { Router } from 'express'
import { authController } from '../controllers/auth'
import {
  employeeRegistrationSchema,
  userLoginSchema,
  userUpdatePasswordSchema
} from '../schemas/auth/userAuthSchema'
import { adminLoginSchema } from '../schemas/auth/adminAuthSchema'
import { MiddleWares } from '../middlewares'

const AuthRoute = Router()

AuthRoute.post(
  '/login/users',
  MiddleWares.validate({ body: userLoginSchema }),
  authController.userLogin
)

AuthRoute.post(
  '/register/users',
  MiddleWares.validate({ body: employeeRegistrationSchema }),
  authController.userRegister
)

AuthRoute.post(
  '/login/administrators',
  MiddleWares.validate({ body: adminLoginSchema }),
  authController.administratorLogin
)

AuthRoute.patch(
  '/reset-password',
  MiddleWares.validate({ body: userUpdatePasswordSchema }),
  authController.updatePassword
)

export default AuthRoute
