import { Router } from 'express'
import { authController } from '../controllers/auth'
import { MiddleWares } from '../middlewares'
import { adminUpdateSchema, userLoginSchema } from '../schemas/AuthSchema'
import { userRegistrationSchema } from '../schemas/AuthSchema'
import { adminLoginSchema } from '../schemas/AuthSchema'

const AuthRoute = Router()

AuthRoute.post(
  '/login/users',
  MiddleWares.validate({ body: userLoginSchema }),
  authController.userLogin
)

AuthRoute.post(
  '/register/users',
  MiddleWares.validate({ body: userRegistrationSchema }),
  authController.userRegister
)

AuthRoute.post(
  '/login/administrators',
  MiddleWares.validate({ body: adminLoginSchema }),
  authController.administratorLogin
)

AuthRoute.patch(
  '/reset-password',
  MiddleWares.validate({ body: adminUpdateSchema }),
  authController.updatePassword
)

export default AuthRoute
