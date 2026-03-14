import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ICoinAttributes extends IBaseModelFields {
  coinId: number
  coinName: string
  coinSymbol: string
  coinImage: string
}

export type ICoinCreationAttributes = Omit<
  ICoinAttributes,
  'coinId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface CoinInstance
  extends Model<ICoinAttributes, ICoinCreationAttributes>,
    ICoinAttributes {}

export const CoinModel = sequelizeInit.define<CoinInstance>(
  'Coins',
  {
    ...BaseModelFields,
    coinId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    coinName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    coinSymbol: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    coinImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: 'coins',
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
