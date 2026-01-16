import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { SubscriptionInstance } from '../interfaces/subscription/subscription.dto'
import { BaseModelFields } from '../database/baseModelFields'
import { CompanyModel } from './companyModel'

export const SubscriptionModel = sequelize.define<SubscriptionInstance>(
  'Subscriptions',
  {
    ...BaseModelFields,
    subscriptionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    subscriptionCompanyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionBillingPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionPlanName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subscriptionPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subscriptionDurationMonth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subscriptionMaxUser: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionMaxOffice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    subscriptionPlan: {
      type: DataTypes.ENUM('trial', 'subscription', 'custom'),
      allowNull: false,
      defaultValue: 'trial'
    },
    subscriptionStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    subscriptionNextBillingDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'subscriptions',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)

SubscriptionModel.belongsTo(CompanyModel, {
  foreignKey: 'subscriptionCompanyId',
  as: 'company'
})
CompanyModel.hasOne(SubscriptionModel, {
  foreignKey: 'subscriptionCompanyId',
  as: 'subscription'
})
