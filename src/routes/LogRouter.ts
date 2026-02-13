import { Router } from 'express'
import { LogController } from '../controllers/log'
import { MiddleWares } from '../middlewares'

const LogRouter = Router()

LogRouter.use(MiddleWares.useAuthorization)
LogRouter.post('/', LogController.create)
LogRouter.get('/', LogController.findAll)

export default LogRouter
