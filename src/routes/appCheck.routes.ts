import { Router } from 'express'
import { appChekController } from '../controllers/appCheck'

const router = Router()

router.get('/', appChekController.mainApp)
router.get('/health', appChekController.healthCheck)

export default router
