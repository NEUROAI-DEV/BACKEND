import { indexingTextDocuments } from './textIndexing'
import { indexingPdfDocuments } from './pdfIndexing'
import { findAllIndexings } from './findAllIndexings'
import { removeIndexingById } from './deleteIndexingById'

export const IndexingController = {
  indexingTextDocuments,
  indexingPdfDocuments,
  findAllIndexings,
  removeIndexingById
}
