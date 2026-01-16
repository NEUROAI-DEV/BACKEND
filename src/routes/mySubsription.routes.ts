import { Router } from 'express'
import { middleware } from '../middlewares'
import { subscriptionController } from '../controllers/subscription'

const router = Router()

router.use(middleware.useAuthorization)

router.get(
  '/my-subscriptions',
  middleware.allowAppRoles('admin'),
  middleware.allowMembershipRoles('company'),
  subscriptionController.findMySubscription
)

export default router
