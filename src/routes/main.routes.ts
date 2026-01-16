import type { Express } from 'express'
import appCheckRoutes from './appCheck.routes'
import authRoutes from './auth.routes'
import statisticRoutes from './statistic.routes'
import myProfileRoutes from './myProfile.routes'
import otpRoutes from './otp.routes'
import membershipRoutes from './membership.routes'
import subscriptionRoutes from './mySubsription.routes'
import appInfoRoutes from './appInfo.routes'
import administratorRoutes from './administrators.routes'
import transactionRoutes from './transaction.routes'
import billingPlanRoutes from './billingPlan.routes'

const apiVersion = '/api/v1'

export const appRouterV1 = (app: Express): void => {
  app.use(apiVersion, appCheckRoutes)
  app.use(apiVersion + '/info', appInfoRoutes)
  app.use(apiVersion + '/auth', authRoutes)
  app.use(apiVersion + '/statistic', statisticRoutes)
  app.use(apiVersion + '/my-profiles', myProfileRoutes)
  app.use(apiVersion + '/otp', otpRoutes)
  app.use(apiVersion + '/memberships', membershipRoutes)
  app.use(apiVersion + '/subscriptions', subscriptionRoutes)
  app.use(apiVersion + '/administrators', administratorRoutes)
  app.use(apiVersion + '/transactions', transactionRoutes)
  app.use(apiVersion + '/billing-plans', billingPlanRoutes)
}
