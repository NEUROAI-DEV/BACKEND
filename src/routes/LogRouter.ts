import { Router } from 'express'
import { LogController } from '../controllers/log'
import { MiddleWares } from '../middlewares'
import { createLogSchema, findAllLogsSchema } from '../schemas/LogSchema'

const LogRouter = Router()

// LogRouter.use(MiddleWares.useAuthorization)
LogRouter.post('/', MiddleWares.validate({ body: createLogSchema }), LogController.create)
LogRouter.get(
  '/',
  MiddleWares.validate({ query: findAllLogsSchema }),
  LogController.findAll
)

export default LogRouter
