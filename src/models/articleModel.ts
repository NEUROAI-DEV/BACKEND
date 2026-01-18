import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'
import { ArticleInstance } from '../interfaces/article/article.dto'

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
