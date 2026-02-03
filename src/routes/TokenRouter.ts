import { Router } from 'express'
import { TokenController } from '../controllers/token'

const TokenRoute = Router()

TokenRoute.get('/screener', TokenController.findAll)
TokenRoute.post('/screener', TokenController.create)

export default TokenRoute
