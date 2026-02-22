import { indexChatDocuments } from './indexChatDocuments'
import { indexChatDocumentsFromPdf } from './indexChatDocumentsFromPdf'
import { getAllIndexings } from './findAllIndexings'
import { removeIndexingById } from './deleteIndexingById'

export const IndexingController = {
  indexChatDocuments,
  indexChatDocumentsFromPdf,
  getAllIndexings,
  removeIndexingById
}
