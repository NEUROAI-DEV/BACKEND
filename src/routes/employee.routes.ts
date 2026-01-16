import { Router } from 'express'
import { middleware } from '../middlewares'
import { employeeController } from '../controllers/token'

const router = Router()

router.use(middleware.useAuthorization)
router.use(middleware.allowMembershipRoles('company'))
router.use(middleware.allowAppRoles('admin', 'superAdmin'))

router.get('/', employeeController.findAll)
router.get('/detail/:employeeId', employeeController.findDetail)
router.patch('/', employeeController.update)

export default router
