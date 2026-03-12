import { Router } from 'express'
import { SubscriptionPlanController } from '../controllers/subscriptionPlan'
import { MiddleWares } from '../middlewares'
import {
  CreateSubscriptionPlanSchema,
  FindAllSubscriptionPlanSchema,
  FindDetailSubscriptionPlanSchema,
  RemoveSubscriptionPlanSchema,
  UpdateSubscriptionPlanSchema
} from '../schemas/SubscriptionPlanSchema'

const SubscriptionPlanRouter = Router()

SubscriptionPlanRouter.get(
  '/',
  MiddleWares.validate({ query: FindAllSubscriptionPlanSchema }),
  SubscriptionPlanController.findAll
)

SubscriptionPlanRouter.get(
  '/detail/:subscriptionPlanId',
  MiddleWares.validate({ params: FindDetailSubscriptionPlanSchema }),
  SubscriptionPlanController.findDetail
)

SubscriptionPlanRouter.post(
  '/',
  // MiddleWares.useAuthorization,
  MiddleWares.validate({ body: CreateSubscriptionPlanSchema }),
  SubscriptionPlanController.create
)

SubscriptionPlanRouter.patch(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: UpdateSubscriptionPlanSchema }),
  SubscriptionPlanController.update
)

SubscriptionPlanRouter.delete(
  '/',
  MiddleWares.useAuthorization,
  MiddleWares.validate({ body: RemoveSubscriptionPlanSchema }),
  SubscriptionPlanController.remove
)

export default SubscriptionPlanRouter
