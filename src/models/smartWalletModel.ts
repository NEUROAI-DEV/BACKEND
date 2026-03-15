import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'
import { SmartWalletTrackerModel } from './smartWalletTrackerModel'

export interface ISmartWalletAttributes extends IBaseModelFields {
  smartWalletId: number
  smartWalletAddress: string
  smartWalletName: string
}

export type ISmartWalletCreationAttributes = Omit<
  ISmartWalletAttributes,
  'smartWalletId' | 'createdAt' | 'updatedAt' | 'deletedAt'
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    smartWalletName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    tableName: 'smart_wallets',
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)

SmartWalletModel.hasMany(SmartWalletTrackerModel, {
  foreignKey: 'smartWalletTrackerSmartWalletId',
  as: 'smartWalletTrackers'
})
SmartWalletTrackerModel.belongsTo(SmartWalletModel, {
  foreignKey: 'smartWalletTrackerSmartWalletId',
  as: 'smartWallet'
})
