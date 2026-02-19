import { createArticle } from './create'
import { findAllArticle } from './findAll'
import { findDetailArticle } from './findDetail'
import { removeArticle } from './remove'
import { updateArticle } from './update'

export const ArticleController = {
  findAll: findAllArticle,
  findDetail: findDetailArticle,
  create: createArticle,
  update: updateArticle,
  remove: removeArticle
}
