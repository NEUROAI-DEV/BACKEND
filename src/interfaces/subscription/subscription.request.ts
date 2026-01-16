import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface ISubscriptionCreateRequest {
  jwtPayload: IJwtPayload
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

export interface ISubscriptionFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
}

export interface ISubscriptionFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface IFindMySubscriptionRequest {
  jwtPayload: IJwtPayload
}

export interface ISubscriptionRemoveRequest extends ISubscriptionFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface ISubscriptionUpdateRequest {
  jwtPayload: IJwtPayload
  subscriptionId: number
  subscriptionCompanyId?: number
  subscriptionBillingPlanId?: number
  subscriptionPlanName?: string
  subscriptionPrice?: number
  subscriptionDurationMonth?: number
  subscriptionMaxUser?: number
  subscriptionMaxOffice?: number
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled'
  subscriptionPlan?: 'trial' | 'subscription' | 'custom'
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  subscriptionNextBillingDate?: Date
}
