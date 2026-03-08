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
  newsSentimentConfidence?: number
  newsSentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  newsSentimentReason?: string
  newsSentimentCategory?: 'TRENDING' | 'NORMAL'
  neswCoinImpact?: string
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
      type: DataTypes.STRING,
      allowNull: true
    },
    newsSlug: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    newsTitle: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    newsDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    newsPublishedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    newsCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    newsKind: {
      type: DataTypes.STRING,
      allowNull: true
    },
    newsSentimentCategory: {
      type: DataTypes.ENUM('TRENDING', 'NORMAL'),
      allowNull: true
    },
    newsSentimentConfidence: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    newsSentiment: {
      type: DataTypes.ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL'),
      allowNull: true
    },
    newsSentimentReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    neswCoinImpact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
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
