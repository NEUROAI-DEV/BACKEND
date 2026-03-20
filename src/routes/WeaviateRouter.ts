import { Router } from 'express'
import { MiddleWares } from '../middlewares'
import { WeaviateController } from '../controllers/weaviate'

const WeaviateRouter = Router()

WeaviateRouter.use(MiddleWares.useAuthorization)

WeaviateRouter.post('/index', WeaviateController.indexingTextDocuments)
WeaviateRouter.get('/index', WeaviateController.findAllIndexings)
// WeaviateRouter.post('/index', WeaviateController.indexingPdfDocuments)
WeaviateRouter.delete('/index/:id', WeaviateController.removeIndexingById)

export default WeaviateRouter
