import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IScreenerAttributes extends IBaseModelFields {
  screenerId: number
  screenerUserId: number
  screenerCoinSymbol: string
  screenerProfile: 'SCALPING' | 'SWING' | 'INVEST'
}

export type IScreenerCreationAttributes = Omit<
  IScreenerAttributes,
  'screenerId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface ScreenerInstance
  extends Model<IScreenerAttributes, IScreenerCreationAttributes>,
    IScreenerAttributes {}

export const ScreenerModel = sequelizeInit.define<ScreenerInstance>(
  'Screeners',
  {
    ...BaseModelFields,
    screenerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    screenerUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    screenerCoinSymbol: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    screenerProfile: {
      type: DataTypes.ENUM('SCALPING', 'SWING', 'INVEST'),
      allowNull: false,
      defaultValue: 'SCALPING'
    }
  },
  {
    tableName: 'screener',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
