import { Router } from 'express'
import { SubscriptionController } from '../controllers/subscription'
import { MiddleWares } from '../middlewares'

const SubscriptionRouter = Router()

SubscriptionRouter.use(MiddleWares.useAuthorization)

SubscriptionRouter.post('/free-trial', SubscriptionController.startFreeTrial)
SubscriptionRouter.post('/subscribe/monthly', SubscriptionController.subscribeMonthly)

export default SubscriptionRouter
