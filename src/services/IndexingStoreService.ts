import { Op } from 'sequelize'
import { IndexingModel, type IndexingSourceType } from '../models/indexingModel'
import { deleteByContentAndSource } from './WeaviateRagService'

export type IndexingDocument = { content: string; source?: string }

/**
 * Backup indexed documents to main database (setiap indexing ke Weaviate juga disimpan di sini).
 */
export async function saveIndexingBackup(
  documents: IndexingDocument[],
  sourceType: IndexingSourceType = 'json'
): Promise<void> {
  if (documents.length === 0) return
  await IndexingModel.bulkCreate(
    documents.map((d) => ({
      content: d.content,
      source: d.source ?? null,
      sourceType
    }))
  )
}

export interface FindAllIndexingsParams {
  page: number
  limit: number
  source?: string | null
  sourceType?: IndexingSourceType | null
  search?: string | null
}

export async function findAllIndexings(params: FindAllIndexingsParams) {
  const { page, limit, source, sourceType, search } = params
  const where: Record<string, unknown> = {}

  if (source != null && String(source).trim() !== '') {
    where.source = { [Op.like]: `%${String(source).trim()}%` }
  }
  if (sourceType != null && ['pdf', 'json'].includes(sourceType)) {
    where.sourceType = sourceType
  }
  if (search != null && String(search).trim() !== '') {
    const term = `%${String(search).trim()}%`
    const orCondition = [
      { content: { [Op.like]: term } },
      { source: { [Op.like]: term } }
    ]
    Object.assign(where, { [Op.or]: orCondition })
  }

  const { count, rows } = await IndexingModel.findAndCountAll({
    where: where as any,
    order: [['indexingId', 'DESC']],
    limit,
    offset: (page - 1) * limit
  })

  const totalPages = Math.ceil(count / limit) || 1
  return {
    items: rows,
    pagination: { total: count, page, limit, totalPages }
  }
}

/**
 * Hapus satu indexing dari DB utama dan dari Weaviate (content + source dipakai untuk hapus di Weaviate).
 */
export async function deleteIndexingById(indexingId: number): Promise<boolean> {
  const row = await IndexingModel.findByPk(indexingId)
  if (!row) return false

  const content = row.content
  const source = row.source ?? ''

  await IndexingModel.destroy({ where: { indexingId } })
  await deleteByContentAndSource(content, source)
  return true
}
