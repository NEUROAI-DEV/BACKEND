import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface ISubscriptionAttributes extends IBaseModelFields {
  subscriptionId: number
  subscriptionCompanyId: number
  subscriptionBillingPlanId: number
  subscriptionPlanName: string
  subscriptionPrice: number
  subscriptionDurationMonth: number
  subscriptionMaxUser: number
  subscriptionMaxOffice: number
  subscriptionStatus: 'active' | 'inactive' | 'cancelled'
  subscriptionPlan: 'trial' | 'subscription' | 'custom'
  subscriptionStartDate: Date
  subscriptionEndDate: Date
  subscriptionNextBillingDate: Date
}

export type ISubscriptionCreationAttributes = Omit<
  ISubscriptionAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface SubscriptionInstance
  extends Model<ISubscriptionAttributes, ISubscriptionCreationAttributes>,
    ISubscriptionAttributes {}
