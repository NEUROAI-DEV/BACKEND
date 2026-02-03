import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ITokenMetricAttributes extends IBaseModelFields {
  tokenMetricId: number
  tokenMetricTokenId: number
  tokenMetricPriceUsd: number
  tokenMetricPriceChange24h: number
  tokenMetricMarketCapUsd: number
  tokenMetricDexVolume24hUsd: number
  tokenMetricLiquidityUsd: number
  tokenMetricDexBuy24hUsd: number
  tokenMetricDexSell24hUsd: number
  tokenMetricDexFlow24hUsd: number
}

export type ITokenMetricCreationAttributes = Omit<
  ITokenMetricAttributes,
  'tokenMetricId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface TokenMetricInstance
  extends Model<ITokenMetricAttributes, ITokenMetricCreationAttributes>,
    ITokenMetricAttributes {}

export const TokenMetricModel = sequelizeInit.define<TokenMetricInstance>(
  'TokenMetrics',
  {
    ...BaseModelFields,
    tokenMetricId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    tokenMetricTokenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    tokenMetricPriceUsd: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricPriceChange24h: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricMarketCapUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricDexVolume24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricLiquidityUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricDexBuy24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricDexSell24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    tokenMetricDexFlow24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: 'token_metrics',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
