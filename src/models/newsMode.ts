import { DataTypes, Model } from 'sequelize'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'
import { sequelizeInit } from '../configs/database'

export interface INewsAttributes extends IBaseModelFields {
  newsId: number
  newsExternalId: string
  newsSlug: string
  newsTitle: string
  newsDescription: string
  newsPublishedAt: string
  newsCreatedAt: string
  newsKind: string
}

export type INewsCreationAttributes = Omit<
  INewsAttributes,
  'newsId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface NewsInstance
  extends Model<INewsAttributes, INewsCreationAttributes>,
    INewsAttributes {}

export const NewsModel = sequelizeInit.define<NewsInstance>(
  'News',
  {
    ...BaseModelFields,
    newsId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    newsExternalId: {
      type: DataTypes.STRING(250),
      unique: true
    },
    newsSlug: {
      type: DataTypes.TEXT,
      unique: true
    },
    newsTitle: {
      type: DataTypes.TEXT,
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
    newsKind: {
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
