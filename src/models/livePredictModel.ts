import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IPredictionItem {
  timestamp: number
  datetime: string
  predicted_price: number
  change_amount: number
  change_percent: number
}

export interface ILivePredictAttributes extends IBaseModelFields {
  livePredictId: number
  livePredictSymbol: string
  livePredictInterval?: string
  livePredictLastPrice?: number
  livePredictIcon?: string
  livePredictResults?: IPredictionItem[]
}

export type ILivePredictCreationAttributes = Omit<
  ILivePredictAttributes,
  'livePredictId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface LivePredictInstance
  extends Model<ILivePredictAttributes, ILivePredictCreationAttributes>,
    ILivePredictAttributes {}

export const LivePredictModel = sequelizeInit.define<LivePredictInstance>(
  'LivePredicts',
  {
    ...BaseModelFields,
    livePredictId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    livePredictSymbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    livePredictIcon: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    livePredictResults: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    livePredictInterval: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '1h'
    },
    livePredictLastPrice: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: true
    }
  },
  {
    tableName: 'live_predicts',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
