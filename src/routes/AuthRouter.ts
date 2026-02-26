import { Router } from 'express'
import { authController } from '../controllers/auth'
import { MiddleWares } from '../middlewares'
import {
  AdminUpdateSchema,
  UserLoginSchema,
  UserRegistrationSchema,
  AdminLoginSchema
} from '../schemas/AuthSchema'

const AuthRoute = Router()

AuthRoute.post(
  '/login/users',
  MiddleWares.validate({ body: UserLoginSchema }),
  authController.userLogin
)

AuthRoute.post(
  '/register/users',
  MiddleWares.validate({ body: UserRegistrationSchema }),
  authController.userRegister
)

AuthRoute.post(
  '/login/administrators',
  MiddleWares.validate({ body: AdminLoginSchema }),
  authController.administratorLogin
)

AuthRoute.patch(
  '/reset-password',
  MiddleWares.validate({ body: AdminUpdateSchema }),
  authController.updatePassword
)

export default AuthRoute
