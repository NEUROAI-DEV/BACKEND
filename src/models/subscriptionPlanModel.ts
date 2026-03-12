import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface ISubscriptionPlanAttributes extends IBaseModelFields {
  subscriptionPlanId: number
  subscriptionPlanName: string
  subscriptionPlanOrder: number
  subscriptionPlanDescription: string
  subscriptionPlanPriceMonthly: number
  subscriptionPlanPriceYearly: number
  subscriptionPlanInterval: 'MONTHLY' | 'YEARLY'
}

export type ISubscriptionPlanCreationAttributes = Omit<
  ISubscriptionPlanAttributes,
  'subscriptionPlanId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface SubscriptionPlanInstance
  extends Model<ISubscriptionPlanAttributes, ISubscriptionPlanCreationAttributes>,
    ISubscriptionPlanAttributes {}

export const SubscriptionPlanModel = sequelizeInit.define<SubscriptionPlanInstance>(
  'SubscriptionPlans',
  {
    ...BaseModelFields,
    subscriptionPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    subscriptionPlanName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    subscriptionPlanOrder: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    subscriptionPlanDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    subscriptionPlanPriceMonthly: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    subscriptionPlanPriceYearly: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: true
    },
    subscriptionPlanInterval: {
      type: DataTypes.ENUM('MONTHLY', 'YEARLY'),
      allowNull: false,
      defaultValue: 'MONTHLY'
    }
  },
  {
    tableName: 'subscription_plans',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
