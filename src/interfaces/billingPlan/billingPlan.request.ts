import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IBillingPlanCreateRequest {
  jwtPayload: IJwtPayload
  billingPlanName: string
  billingPlanCategory: 'trial' | 'subscription' | 'custom'
  billingPlanPricePerUser: number
  billingPlanDiscountPercentage: number
  billingPlanDurationMonth: number
}

export interface IBillingPlanFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  billingPlanId: number
}

export interface IBillingPlanFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface IBillingPlanRemoveRequest extends IBillingPlanFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface IBillingPlanUpdateRequest {
  jwtPayload: IJwtPayload
  billingPlanId: number
  billingPlanName?: string
  billingPlanCategory?: 'trial' | 'subscription' | 'custom'
  billingPlanPricePerUser?: number
  billingPlanDiscountPercentage?: number
  billingPlanDurationMonth?: number
}
