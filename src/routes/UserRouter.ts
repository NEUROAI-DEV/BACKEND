import { Router } from 'express'
import { UserController } from '../controllers/user'
import { MiddleWares } from '../middlewares'
import { findAllUsersSchema } from '../schemas/UserSchema'

const UserRouter = Router()

UserRouter.use(MiddleWares.useAuthorization)
UserRouter.get(
  '/',
  MiddleWares.validate({ query: findAllUsersSchema }),
  UserController.findAll
)

export default UserRouter
