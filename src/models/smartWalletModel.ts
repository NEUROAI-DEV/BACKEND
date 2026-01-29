import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ISmartWalletAttributes extends IBaseModelFields {
  smartWalletId: number
  smartWalletAddress: string
  smartWalletTotalProfitUsd: number
  smartWalletWinRate: number
  smartWalletTradeCount: number
  smartWalletScore: number
  smartWalletIsSmart: boolean
}

export type ISmartWalletCreationAttributes = Omit<
  ISmartWalletAttributes,
  'articleId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface SmartWalletInstance
  extends Model<ISmartWalletAttributes, ISmartWalletCreationAttributes>,
    ISmartWalletAttributes {}

export const SmartWalletModel = sequelizeInit.define<SmartWalletInstance>(
  'SmartWallets',
  {
    ...BaseModelFields,
    smartWalletId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    smartWalletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    },
    smartWalletTotalProfitUsd: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    smartWalletWinRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    smartWalletTradeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    smartWalletScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    smartWalletIsSmart: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: 'smart_wallets',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
