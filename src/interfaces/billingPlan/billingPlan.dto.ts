import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IBillingPlanAttributes extends IBaseModelFields {
  billingPlanId: number
  billingPlanName: string
  billingPlanCategory: 'trial' | 'subscription' | 'custom'
  billingPlanPricePerUser: number
  billingPlanDiscountPercentage: number
  billingPlanDurationMonth: number
}

export type IBillingPlanCreationAttributes = Omit<
  IBillingPlanAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface BillingPlanInstance
  extends Model<IBillingPlanAttributes, IBillingPlanCreationAttributes>,
    IBillingPlanAttributes {}
