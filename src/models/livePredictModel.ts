import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ILivePredictAttributes extends IBaseModelFields {
  livePredictId: number
  livePredictUserId: number
  livePredictSymbols: string
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
    livePredictUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    livePredictSymbols: {
      type: DataTypes.JSON,
      allowNull: false
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
