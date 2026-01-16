import { Router } from 'express'
import { appChekController } from '../controllers/appCheck'
import { middleware } from '../middlewares'

const router = Router()

router.use(middleware.useAuthorization)
router.use(middleware.allowAppRoles('user', 'admin'))
router.use(middleware.allowMembershipRoles('company', 'employee'))

router.get('/', appChekController.appInfo)

export default router
