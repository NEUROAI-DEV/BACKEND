import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'

export const SmartWalletModel = sequelize.define(
  'SmartWallets',
  {
    ...BaseModelFields,
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    walletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    },
    totalProfitUsd: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0
    },
    winRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    tradeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    smartScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    isSmart: {
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
