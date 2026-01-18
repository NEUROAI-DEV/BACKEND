import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'

export const TokenMetricModel = sequelize.define(
  'TokenMetrics',
  {
    ...BaseModelFields,
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    tokenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    priceUsd: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      defaultValue: 0
    },
    priceChange24h: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    marketCapUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    dexVolume24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    liquidityUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    dexBuy24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    dexSell24hUsd: {
      type: DataTypes.DECIMAL(30, 2),
      allowNull: false,
      defaultValue: 0
    },
    dexFlow24hUsd: {
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
