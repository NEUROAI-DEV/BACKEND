import { Router } from 'express'
import { ChatController } from '../controllers/chat'

const ChatRouter = Router()

ChatRouter.post('/', ChatController.createChatCompletion)

export default ChatRouter
