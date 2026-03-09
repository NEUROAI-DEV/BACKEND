import express, { type Express } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import routers from './routes'
import { MiddleWares } from './middlewares'
import { Scheduler } from './schedulers'
import path from 'path'
import logger from '../logs'

const app: Express = express()

// Scheduler.NewsScheduler()
Scheduler.DailySummaryScheduler()
Scheduler.runStartupCheck().catch((err) =>
  logger.error('[Scheduler] Startup check error:', err)
)

Scheduler.CoinMarketScheduler.start()
Scheduler.ScreenerScheduler.start()

app.use(helmet())
app.use(MiddleWares.corsOrigin())
// app.use(MiddleWares.limiter())
app.use(MiddleWares.loggerMidleWare())

app.use(express.static(path.join(process.cwd(), 'uploads/images')))

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(compression())

app.use(routers)

export default app
