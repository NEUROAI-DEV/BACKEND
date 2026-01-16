import { Router } from 'express'
import { middleware } from '../middlewares'
import { companyControllers } from '../controllers/company'

const router = Router()

router.use(middleware.useAuthorization)
router.use(middleware.allowAppRoles('admin', 'superAdmin'))

router.get('/', companyControllers.findAll)
router.get(
  '/detail/',
  middleware.allowMembershipRoles('company'),
  companyControllers.findDetail
)
router.patch('/', middleware.allowMembershipRoles('company'), companyControllers.update)

export default router
