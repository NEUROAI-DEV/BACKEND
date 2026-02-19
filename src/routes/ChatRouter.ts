import { Router } from 'express'
import { ChatController } from '../controllers/chat'
import { uploadPdfMiddleware } from '../configs/multer'

const ChatRouter = Router()

ChatRouter.post('/', ChatController.createChatCompletion)
ChatRouter.get('/index', ChatController.getAllIndexings)
ChatRouter.post('/index', ChatController.indexChatDocuments)
ChatRouter.delete('/index/:id', ChatController.removeIndexingById)
ChatRouter.post(
  '/index/pdf',
  uploadPdfMiddleware.single('file'),
  ChatController.indexChatDocumentsFromPdf
)

export default ChatRouter
