import { Router } from 'express'
import { middleware } from '../middlewares'
import { transactionControllers } from '../controllers/transation'

const router = Router()

router.use(middleware.useAuthorization)
router.use(middleware.allowAppRoles('admin'))
router.use(middleware.allowMembershipRoles('company'))

router.get('/', transactionControllers.findAll)
router.post('/', transactionControllers.create)

export default router
