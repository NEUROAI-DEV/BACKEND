import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IPredictAttributes extends IBaseModelFields {
  predictId: number
  predictUserId: number
  predictSymbol: string
  predictCoinIcon: string
  predictType?: 'SCALPING' | 'SWING' | 'INVESTING'
  predictPrice?: number
  predictTakeProfit?: number
  predictStopLoss?: number
  predictEntryPrice?: number
  predictReason?: string
  predictPotentialGain?: number
  predictPotentialLoss?: number
}

export type IPredictCreationAttributes = Omit<
  IPredictAttributes,
  'predictId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface PredictInstance
  extends Model<IPredictAttributes, IPredictCreationAttributes>,
    IPredictAttributes {}

export const PredictModel = sequelizeInit.define<PredictInstance>(
  'Predicts',
  {
    ...BaseModelFields,
    predictId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    predictUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    predictSymbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    predictCoinIcon: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    predictType: {
      type: DataTypes.ENUM('SCALPING', 'SWING', 'INVESTING'),
      allowNull: false,
      defaultValue: 'SCALPING'
    },
    predictPrice: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    predictTakeProfit: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    predictStopLoss: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    predictEntryPrice: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    predictReason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    predictPotentialGain: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    predictPotentialLoss: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    }
  },
  {
    tableName: 'predicts',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
