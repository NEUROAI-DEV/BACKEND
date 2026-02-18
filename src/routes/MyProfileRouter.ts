import { Router } from 'express'
import { myProfileController } from '../controllers/myProfile'
import { MiddleWares } from '../middlewares'
import { updateMyProfileSchema, updateOnboardingSchema } from '../schemas/myProfileSchema'

const MyProfileRoute = Router()

MyProfileRoute.use(MiddleWares.useAuthorization)
MyProfileRoute.get('/', myProfileController.find)
MyProfileRoute.patch(
  '/',
  MiddleWares.validate({ body: updateMyProfileSchema }),
  myProfileController.update
)
MyProfileRoute.patch(
  '/onboardings',
  MiddleWares.allowAppRoles('admin'),
  MiddleWares.validate({ body: updateOnboardingSchema }),
  myProfileController.updateOnboardingStatus
)

export default MyProfileRoute
