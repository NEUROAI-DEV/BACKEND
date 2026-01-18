import { Router } from 'express'
import { TokenController } from '../controllers/token'

const router = Router()

router.get('/screener', TokenController.findAll)
router.post('/screener', TokenController.create)

export default router
