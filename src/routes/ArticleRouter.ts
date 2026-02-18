import { Router } from 'express'
import { ArticleController } from '../controllers/article'
import { MiddleWares } from '../middlewares'
import {
  createArticleSchema,
  findAllArticleSchema,
  findDetailArticleSchema,
  removeArticleSchema,
  updateArticleSchema
} from '../schemas/articleSchema'

const ArticleRoute = Router()

ArticleRoute.get(
  '/',
  MiddleWares.validate({ query: findAllArticleSchema }),
  ArticleController.findAll
)

ArticleRoute.get(
  '/detail/:articleId',
  MiddleWares.validate({ params: findDetailArticleSchema }),
  ArticleController.findDetail
)

ArticleRoute.post(
  '/',
  MiddleWares.validate({ body: createArticleSchema }),
  ArticleController.create
)
ArticleRoute.patch(
  '/',
  MiddleWares.validate({ body: updateArticleSchema }),
  ArticleController.update
)
ArticleRoute.delete(
  '/',
  MiddleWares.validate({ body: removeArticleSchema }),
  ArticleController.remove
)

export default ArticleRoute
