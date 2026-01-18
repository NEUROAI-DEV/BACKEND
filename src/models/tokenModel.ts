import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'
import { TokenMetricModel } from './tokenMetricModel'

export const TokenModel = sequelize.define(
  'Tokens',
  {
    ...BaseModelFields,
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    contractAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 18
    },
    chain: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: 'ethereum'
    }
  },
  {
    tableName: 'tokens',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)

TokenModel.hasMany(TokenMetricModel, { foreignKey: 'tokenId' })
TokenMetricModel.belongsTo(TokenModel, { foreignKey: 'tokenId' })
