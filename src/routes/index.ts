import express, { Router } from 'express'
import path from 'path'

import { StatusCodes } from 'http-status-codes'
import swaggerUi from 'swagger-ui-express'

import RoutesRegistry from './registry'
import logger from '../../logs'
import { ResponseData } from '../utilities/response'
import swaggerSpec from '../configs/swagger'

const routers = Router()

routers.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

routers.use('/api/v1/', RoutesRegistry.AppCheckRoute)
routers.use('/api/v1/articles', RoutesRegistry.ArticleRoute)
routers.use('/api/v1/auth', RoutesRegistry.AuthRoute)
routers.use('/api/v1/subscriptions', RoutesRegistry.SubscriptionRoute)
routers.use('/api/v1/subscription-plans', RoutesRegistry.SubscriptionPlanRouter)
routers.use('/api/v1/transactions', RoutesRegistry.TransactionRouter)
routers.use('/api/v1/live-predicts', RoutesRegistry.LivePredictRouter)
routers.use('/api/v1/coins', RoutesRegistry.CoinRouter)
routers.use('/api/v1/smart-wallets', RoutesRegistry.SmartWalletRouter)
routers.use('/api/v1/my-profiles', RoutesRegistry.MyProfileRoute)
routers.use('/api/v1/news', RoutesRegistry.NewsRoute)
routers.use('/api/v1/markets', RoutesRegistry.MarketRouter)
routers.use('/api/v1/chat', RoutesRegistry.ChatRoute)
routers.use('/api/v1/screeners', RoutesRegistry.ScreenerRoute)
routers.use('/api/v1/users', RoutesRegistry.UserRoute)
routers.use('/api/v1/logs', RoutesRegistry.LogRoute)
routers.use('/api/v1/stats', RoutesRegistry.StatsRoute)
routers.use('/api/v1/weaviate', RoutesRegistry.WeaviateRoute)
routers.use('/api/v1/watchlist', RoutesRegistry.WatchListRoute)
routers.use('/api/v1/uploads', RoutesRegistry.UploadRouter)
routers.use('/api/v1/otp', RoutesRegistry.OtpRouter)

routers.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

routers.use((req, res) => {
  const message = `Route not found!`
  logger.warn(message)
  const response = ResponseData.error({ message })
  return res.status(StatusCodes.NOT_FOUND).json(response)
})

export default routers
