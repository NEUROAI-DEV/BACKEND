import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields, IBaseModelFields } from '../database/baseModelFields'

export interface INewsAttributes extends IBaseModelFields {
  newsId: number
  newsExternalId: string
  newsSlug: string
  newsTitle: string
  newsDescription: string
  newsPublishedAt: string
  newsCreatedAt: string
  kind: string
}

export type INewsCreationAttributes = Omit<
  INewsAttributes,
  'newsId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface NewsInstance
  extends Model<INewsAttributes, INewsCreationAttributes>,
    INewsAttributes {}

export const NewsModel = sequelize.define<NewsInstance>(
  'News',
  {
    ...BaseModelFields,
    newsId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    newsExternalId: {
      type: DataTypes.STRING(100),
      unique: true
    },
    newsSlug: {
      type: DataTypes.STRING(250),
      unique: true
    },
    newsTitle: {
      type: DataTypes.STRING(250),
      unique: true
    },
    newsDescription: {
      type: DataTypes.TEXT,
      unique: true
    },
    newsPublishedAt: {
      type: DataTypes.STRING,
      unique: true
    },
    newsCreatedAt: {
      type: DataTypes.STRING,
      unique: true
    },
    kind: {
      type: DataTypes.STRING,
      unique: true
    }
  },
  {
    tableName: 'news',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
