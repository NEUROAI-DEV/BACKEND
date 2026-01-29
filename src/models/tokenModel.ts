import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'
import { TokenMetricModel } from './tokenMetricModel'

export interface ITokenAttributes extends IBaseModelFields {
  tokenId: number
  tokenContractAddress: string
  tokenName: string
  tokenSymbol: string
  tokenDecimals: number
  tokenChain: string
}

export type ITokenCreationAttributes = Omit<
  ITokenAttributes,
  'articleId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface TokenInstance
  extends Model<ITokenAttributes, ITokenCreationAttributes>,
    ITokenAttributes {}

export const TokenModel = sequelizeInit.define<TokenInstance>(
  'Tokens',
  {
    ...BaseModelFields,
    tokenId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    tokenContractAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    },
    tokenName: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    tokenSymbol: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    tokenDecimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 18
    },
    tokenChain: {
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
