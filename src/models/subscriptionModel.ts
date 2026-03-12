import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'CANCELED'
  | 'EXPIRED'
  | 'PAST_DUE'

export interface ISubscriptionAttributes extends IBaseModelFields {
  subscriptionId: number
  subscriptionUserId: number
  subscriptionSubscriptionPlanId: number
  subscriptionStatus: SubscriptionStatus
  subscriptionStartDate: Date
  subscriptionEndDate: Date
  subscriptionTrialEndDate?: Date | null
}

export type ISubscriptionCreationAttributes = Omit<
  ISubscriptionAttributes,
  'subscriptionId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface SubscriptionInstance
  extends Model<ISubscriptionAttributes, ISubscriptionCreationAttributes>,
    ISubscriptionAttributes {}

export const SubscriptionModel = sequelizeInit.define<SubscriptionInstance>(
  'Subscriptions',
  {
    ...BaseModelFields,
    subscriptionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    subscriptionUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionSubscriptionPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('TRIALING', 'ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE'),
      allowNull: false,
      defaultValue: 'TRIALING'
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    subscriptionTrialEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'subscriptions',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
