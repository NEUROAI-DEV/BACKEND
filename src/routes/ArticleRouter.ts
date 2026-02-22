import { Router } from 'express'
import { ArticleController } from '../controllers/article'
import { MiddleWares } from '../middlewares'
import {
  CreateArticleSchema,
  FindAllArticleSchema,
  FindDetailArticleSchema,
  RemoveArticleSchema,
  UpdateArticleSchema
} from '../schemas/ArticleSchema'

const ArticleRoute = Router()

ArticleRoute.use(MiddleWares.useAuthorization)

ArticleRoute.get(
  '/',
  MiddleWares.validate({ query: FindAllArticleSchema }),
  ArticleController.findAll
)

ArticleRoute.get(
  '/detail/:articleId',
  MiddleWares.validate({ params: FindDetailArticleSchema }),
  ArticleController.findDetail
)

ArticleRoute.post(
  '/',
  MiddleWares.validate({ body: CreateArticleSchema }),
  ArticleController.create
)
ArticleRoute.patch(
  '/',
  MiddleWares.validate({ body: UpdateArticleSchema }),
  ArticleController.update
)
ArticleRoute.delete(
  '/',
  MiddleWares.validate({ body: RemoveArticleSchema }),
  ArticleController.remove
)

export default ArticleRoute
