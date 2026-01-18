import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IArticleAttributes extends IBaseModelFields {
  articleId: number
  articleTitle: number
  articleDescription: number
}

export type IArticleCreationAttributes = Omit<
  IArticleAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface ArticleInstance
  extends Model<IArticleAttributes, IArticleCreationAttributes>,
    IArticleAttributes {}
