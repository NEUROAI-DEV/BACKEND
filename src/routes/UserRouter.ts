import { Router } from 'express'
import { UserController } from '../controllers/user'
import { MiddleWares } from '../middlewares'

const UserRouter = Router()

UserRouter.use(MiddleWares.useAuthorization)
UserRouter.get('/', UserController.findAll)

export default UserRouter
