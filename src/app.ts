import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction
} from 'express'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import { appRouterV1 } from './routes/main.routes'
import logger from './logs'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { appConfigs } from './configs'
import { handleServerError } from './utilities/requestHandler'
import { StatusCodes } from 'http-status-codes'
import { ResponseData } from './utilities/response'
import { middleware } from './middlewares'

const startTime = Date.now()

const app: Express = express()

app.use(middleware.requestTimer)

app.use(helmet())

app.use(
  cors({
    origin: appConfigs.cors.origin?.toString().split(',') ?? ['http://localhost:5173'],
    credentials: true
  })
)

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cookieParser())

app.use(compression())

const limiter = rateLimit({
  windowMs: parseInt(appConfigs.rateLimit.windowMinutes ?? '15') * 60 * 1000,
  max: parseInt(appConfigs.rateLimit.maxRequest ?? '100')
})
app.use(limiter)

// Trust proxy (for production with nginx/proxy)
app.set('trust proxy', 1)

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  })
)

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

appRouterV1(app)

app.use((req, res) => {
  const message = `Route not found!`
  logger.warn(message)
  const response = ResponseData.error({ message })
  return res.status(StatusCodes.NOT_FOUND).json(response)
})

app.use((serverError: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(serverError.stack)
  return handleServerError(res, serverError)
})

export default app
