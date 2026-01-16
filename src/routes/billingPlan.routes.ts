import { Router } from 'express'
import { billingPlanController } from '../controllers/billingPlan'

const router = Router()

router.get('/', billingPlanController.findAll)

export default router
