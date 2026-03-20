import { Router } from 'express'
import { UserController } from '../controllers/user'
import { MiddleWares } from '../middlewares'
import {
  findAllUsersSchema,
  CreateAdminUserSchema,
  UpdateAdminUserSchema,
  RemoveAdminUserSchema
} from '../schemas/UserSchema'

const UserRouter = Router()

UserRouter.use(MiddleWares.useAuthorization)

UserRouter.get(
  '/',
  MiddleWares.validate({ query: findAllUsersSchema }),
  UserController.findAll
)

UserRouter.get(
  '/admins',
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ query: findAllUsersSchema }),
  UserController.findAllAdmins
)

UserRouter.post(
  '/admin',
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: CreateAdminUserSchema }),
  UserController.createAdmin
)

UserRouter.patch(
  '/admin',
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: UpdateAdminUserSchema }),
  UserController.updateAdmin
)

UserRouter.delete(
  '/admin/:userId',
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ params: RemoveAdminUserSchema }),
  UserController.removeAdmin
)

export default UserRouter
