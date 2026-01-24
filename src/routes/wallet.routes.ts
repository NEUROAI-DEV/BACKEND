import { Router } from 'express'
import { SmartWalletController } from '../controllers/smartWallet'

const router = Router()

router.get('/smart-money', SmartWalletController.findAll)

export default router
