import { DataTypes } from 'sequelize'
import { BaseModelFields } from '../database/baseModelFields'
import { sequelize } from '../database/config'
import { BillingPlanInstance } from '../interfaces/billingPlan/billingPlan.dto'

export const BillingPlanModel = sequelize.define<BillingPlanInstance>(
  'BillingPlans',
  {
    ...BaseModelFields,
    billingPlanId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    billingPlanName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    billingPlanCategory: {
      type: DataTypes.ENUM('trial', 'subscription', 'custom'),
      allowNull: false,
      defaultValue: 'trial'
    },
    billingPlanPricePerUser: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billingPlanDurationMonth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billingPlanDiscountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'billing_plans',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)
