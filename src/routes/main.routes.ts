import type { Express } from 'express'
import appCheckRoutes from './appCheck.routes'
import authRoutes from './auth.routes'
import myProfileRoutes from './myProfile.routes'
import otpRoutes from './otp.routes'
import appInfoRoutes from './appInfo.routes'

const apiVersion = '/api/v1'

export const appRouterV1 = (app: Express): void => {
  app.use(apiVersion, appCheckRoutes)
  app.use(apiVersion + '/info', appInfoRoutes)
  app.use(apiVersion + '/auth', authRoutes)
  app.use(apiVersion + '/my-profiles', myProfileRoutes)
  app.use(apiVersion + '/otp', otpRoutes)
}
