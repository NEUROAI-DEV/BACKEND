import { Router } from 'express'
import { middleware } from '../middlewares'
import { administratorController } from '../controllers/administrators'

const router = Router()

router.use(middleware.useAuthorization)
router.use(middleware.allowAppRoles('superAdmin'))

router.get('/subscriptions', administratorController.findAllSubscription)
router.patch('/subscriptions', administratorController.updateSubscription)
router.get('/transactions', administratorController.findAllTransaction)
router.patch('/transactions', administratorController.updateTransaction)
router.get('/billing-plans', administratorController.findAllBillingPlan)
router.patch('/billing-plans', administratorController.updateBillingPlan)
router.post('/billing-plans', administratorController.createBillingPlan)

export default router
