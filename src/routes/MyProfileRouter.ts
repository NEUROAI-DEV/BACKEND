import { Router } from 'express'
import { middleware } from '../middlewares'
import { myProfileController } from '../controllers/myProfile'

const MyProfileRoute = Router()

MyProfileRoute.use(middleware.useAuthorization)
MyProfileRoute.get('/', myProfileController.find)

MyProfileRoute.patch('/', middleware.useAuthorization, myProfileController.update)

MyProfileRoute.patch(
  '/onboardings',
  middleware.useAuthorization,
  middleware.allowAppRoles('admin'),
  myProfileController.updateOnboardingStatus
)

export default MyProfileRoute
