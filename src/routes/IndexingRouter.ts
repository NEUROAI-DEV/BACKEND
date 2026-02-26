import { Router } from 'express'
import { IndexingController } from '../controllers/indexing'
import { MiddleWares } from '../middlewares'

const IndexingRouter = Router()

IndexingRouter.use(MiddleWares.useAuthorization)

IndexingRouter.post('/', IndexingController.indexChatDocuments)
IndexingRouter.get('/index', IndexingController.getAllIndexings)
IndexingRouter.post('/index', IndexingController.indexChatDocuments)
IndexingRouter.delete('/index/:id', IndexingController.removeIndexingById)

export default IndexingRouter
