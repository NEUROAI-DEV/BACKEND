import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ISmartWalletTrackerAttributes extends IBaseModelFields {
  smartWalletTrackerId: number
  smartWalletTrackerSmartTrackerId: number
  smartWalletTrackerWalletAddress: string
  smartWalletTrackerTokenName: string
  smartWalletTrackerInflow: number
  smartWalletTrackerOutflow: number
}

export type ISmartWalletTrackerCreationAttributes = Omit<
  ISmartWalletTrackerAttributes,
  'smartWalletTrackerId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface SmartWalletTrackerInstance
  extends Model<ISmartWalletTrackerAttributes, ISmartWalletTrackerCreationAttributes>,
    ISmartWalletTrackerAttributes {}

export const SmartWalletTrackerModel = sequelizeInit.define<SmartWalletTrackerInstance>(
  'SmartWalletTrackers',
  {
    ...BaseModelFields,
    smartWalletTrackerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    smartWalletTrackerSmartTrackerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    smartWalletTrackerWalletAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    smartWalletTrackerTokenName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    smartWalletTrackerInflow: {
      type: DataTypes.DECIMAL(36, 18),
      allowNull: false
    },
    smartWalletTrackerOutflow: {
      type: DataTypes.DECIMAL(36, 18),
      allowNull: false
    }
  },
  {
    tableName: 'smart_wallet_trackers',
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
