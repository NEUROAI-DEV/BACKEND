import { Router } from 'express'
import { LogController } from '../controllers/log'
import { MiddleWares } from '../middlewares'
import { CreateLogSchema, FindAllLogsSchema } from '../schemas/LogSchema'

const LogRouter = Router()

LogRouter.use(MiddleWares.useAuthorization)
LogRouter.use(MiddleWares.allowAppRoles('admin'))

LogRouter.post('/', MiddleWares.validate({ body: CreateLogSchema }), LogController.create)

LogRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllLogsSchema }),
  LogController.findAll
)

export default LogRouter
