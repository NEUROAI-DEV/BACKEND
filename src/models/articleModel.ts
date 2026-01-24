import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields, IBaseModelFields } from '../database/baseModelFields'

export interface IArticleAttributes extends IBaseModelFields {
  articleId: number
  articleTitle: string
  articleDescription: string
}

export type IArticleCreationAttributes = Omit<
  IArticleAttributes,
  'articleId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface ArticleInstance
  extends Model<IArticleAttributes, IArticleCreationAttributes>,
    IArticleAttributes {}

export const ArticleModel = sequelize.define<ArticleInstance>(
  'Articles',
  {
    ...BaseModelFields,
    articleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    articleTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    articleDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'articles',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
