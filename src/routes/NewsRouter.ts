import { Router } from 'express'
import { NewsController } from '../controllers/news'

const NewsRoute = Router()

NewsRoute.get('/', NewsController.findAll)

export default NewsRoute
