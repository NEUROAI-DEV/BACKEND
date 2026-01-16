import { Router } from 'express'
import { middleware } from '../middlewares'
import { myProfileController } from '../controllers/myProfile'

const router = Router()

router.use(middleware.useAuthorization)
router.get('/', myProfileController.find)
router.patch('/', middleware.useAuthorization, myProfileController.update)
router.patch(
  '/onboardings',
  middleware.useAuthorization,
  middleware.allowAppRoles('admin'),
  myProfileController.updateOnboardingStatus
)

export default router
