import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IWalletAttributes extends IBaseModelFields {
  walletId: number
  walletAddress: string
}

export type IWalletCreationAttributes = Omit<
  IWalletAttributes,
  'articleId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface WalletInstance
  extends Model<IWalletAttributes, IWalletCreationAttributes>,
    IWalletAttributes {}

export const WalletModel = sequelizeInit.define<WalletInstance>(
  'Wallets',
  {
    ...BaseModelFields,
    walletId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    walletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'wallets',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
