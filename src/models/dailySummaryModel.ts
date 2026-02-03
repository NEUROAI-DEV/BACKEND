import { DataTypes, Model } from 'sequelize'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'
import { sequelizeInit } from '../configs/database'

export interface IDailySummaryAttributes extends IBaseModelFields {
  dailySummaryId: number
  dailySummaryDate: string
  dailySummaryMarketSentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH'
  dailySummaryConfidence: number
  dailySummarySummary: string
  dailySummaryHighlights: string[]
}

export type IDailySummaryCreationAttributes = Omit<
  IDailySummaryAttributes,
  'dailySummaryId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface DailySummaryInstance
  extends Model<IDailySummaryAttributes, IDailySummaryCreationAttributes>,
    IDailySummaryAttributes {}

export const DailySummaryModel = sequelizeInit.define<DailySummaryInstance>(
  'DailySummary',
  {
    ...BaseModelFields,

    dailySummaryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    dailySummaryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },

    dailySummaryMarketSentiment: {
      type: DataTypes.ENUM('BULLISH', 'NEUTRAL', 'BEARISH'),
      allowNull: false
    },

    dailySummaryConfidence: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false
    },

    dailySummarySummary: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    dailySummaryHighlights: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'daily_summaries',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
