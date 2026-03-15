import { Router } from 'express'
import { AppCheckController } from '../controllers/appCheck'

const AppCheckRoute = Router()

AppCheckRoute.get('/', AppCheckController.mainApp)
AppCheckRoute.get('/health', AppCheckController.healthCheck)

export default AppCheckRoute
