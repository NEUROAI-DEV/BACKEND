import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IWalletTransactionAttributes extends IBaseModelFields {
  walletTransactionId: number
  walletTransactionWalletAddress: number
  walletTransactionTxHash: string
  walletTransactionFromAddress: string
  walletTransactionToAddress: string
  walletTransactionTokenAddress: string
  walletTransactionTokenSymbol: string
  walletTransactionValue: number
  walletTransactionTxType: 'BUY' | 'SELL'
  walletTransactionPriceUsd: number
}

export type IWalletCreationAttributes = Omit<
  IWalletTransactionAttributes,
  'articleId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface WalletTransactionInstance
  extends Model<IWalletTransactionAttributes, IWalletCreationAttributes>,
    IWalletTransactionAttributes {}

export const WalletTransactionModel = sequelizeInit.define<WalletTransactionInstance>(
  'WalletTransactions',
  {
    ...BaseModelFields,
    walletTransactionId: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    walletTransactionWalletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    walletTransactionTxHash: {
      type: DataTypes.STRING(66),
      allowNull: false,
      unique: true
    },
    walletTransactionFromAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    walletTransactionToAddress: {
      type: DataTypes.STRING(42),
      allowNull: false
    },
    walletTransactionTokenAddress: {
      type: DataTypes.STRING(42),
      allowNull: true
    },
    walletTransactionTokenSymbol: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    walletTransactionValue: {
      type: DataTypes.DECIMAL(36, 18),
      allowNull: false
    },
    walletTransactionTxType: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false
    },
    walletTransactionPriceUsd: {
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
