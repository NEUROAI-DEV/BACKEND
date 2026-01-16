import { Router } from 'express'
import { statisticController } from '../controllers/statistic'
import { middleware } from '../middlewares'

const router = Router()

router.use(middleware.useAuthorization)

router.get(
  '/total',
  middleware.allowAppRoles('admin'),
  middleware.allowMembershipRoles('company'),
  statisticController.findTotal
)
router.get(
  '/productivities',
  middleware.allowAppRoles('user', 'admin'),
  middleware.allowMembershipRoles('employee', 'company'),
  statisticController.productivities
)

export default router
