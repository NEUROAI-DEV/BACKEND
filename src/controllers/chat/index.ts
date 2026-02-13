import { createChatCompletion } from './createChatCompletion'
import { indexChatDocuments } from './indexChatDocuments'
import { indexChatDocumentsFromPdf } from './indexChatDocumentsFromPdf'
import { getAllIndexings } from './findAllIndexings'
import { removeIndexingById } from './deleteIndexingById'

export const ChatController = {
  createChatCompletion,
  indexChatDocuments,
  indexChatDocumentsFromPdf,
  getAllIndexings,
  removeIndexingById
}
