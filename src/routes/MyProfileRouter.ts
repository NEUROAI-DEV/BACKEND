import { Router } from 'express'
import { myProfileController } from '../controllers/myProfile'
import { MiddleWares } from '../middlewares'
import { UpdateMyProfileSchema, UpdateOnboardingSchema } from '../schemas/MyProfileSchema'

const MyProfileRoute = Router()

MyProfileRoute.use(MiddleWares.useAuthorization)

MyProfileRoute.get('/', myProfileController.find)
MyProfileRoute.patch(
  '/',
  MiddleWares.validate({ body: UpdateMyProfileSchema }),
  myProfileController.update
)
MyProfileRoute.patch(
  '/onboardings',
  MiddleWares.validate({ body: UpdateOnboardingSchema }),
  myProfileController.updateOnboardingStatus
)

export default MyProfileRoute
