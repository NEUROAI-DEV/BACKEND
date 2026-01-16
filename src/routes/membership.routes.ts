import { Router } from 'express'
import { middleware } from '../middlewares'
import { membershipControllers } from '../controllers/membership'

const router = Router()

router.use(middleware.useAuthorization)

router.get(
  '/',
  middleware.allowAppRoles('user', 'admin'),
  middleware.allowMembershipRoles('employee', 'company'),
  membershipControllers.findAll
)
router.post('/invite', middleware.allowAppRoles('user'), membershipControllers.invite)
router.patch(
  '/',
  middleware.allowAppRoles('admin'),
  middleware.allowMembershipRoles('company'),
  membershipControllers.update
)
router.delete(
  '/:membershipId',
  middleware.allowAppRoles('user', 'admin'),
  middleware.allowMembershipRoles('employee', 'company'),
  membershipControllers.remove
)

export default router
