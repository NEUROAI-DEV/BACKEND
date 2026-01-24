import { Router } from 'express'
import { SmartWalletController } from '../controllers/smartWallet'

const WalletRoute = Router()

WalletRoute.get('/smart-money', SmartWalletController.findAll)

export default WalletRoute
