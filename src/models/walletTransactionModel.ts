import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'

export const WalletTransactionModel = sequelize.define(
  'WalletTransactions',
  {
    ...BaseModelFields,
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    walletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    txHash: {
      type: DataTypes.STRING(66),
      allowNull: false,
      unique: true
    },
    fromAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    toAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    tokenAddress: {
      type: DataTypes.STRING(42),
      allowNull: true
    },
    tokenSymbol: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(36, 18),
      allowNull: false
    },
    txType: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false
    },
    priceUsd: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'wallet_transactions',
    timestamps: true,
    underscored: true
  }
)
