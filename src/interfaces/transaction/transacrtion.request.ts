import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface ITransaction {
  jwtPayload: IJwtPayload
  transactionId: number
  transactionBillingPlanId: number
  transactionBillingPlanName: string
  transactionPlanCategory: 'trial' | 'subscription' | 'custom'
  transactionCompanyId: number
  transactionUserId: number
  transactionTotalUser: number
  transactionStatus: 'unpaid' | 'paid' | 'cancel'
  transactionTotalPrice: number
  transactionDurationMonth: number
  transactionTotalDiscount: number
  transactionMethod: 'manual' | 'transfer' | 'gateway' | 'admin'
  transactionReferenceId?: string
  transactionDescription?: string
  transactionPaidAt?: Date
  transactionDueDate?: Date
}

export interface ITransactionFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  transactionId: number
}

export interface ITransactionFindDetailRequest {
  jwtPayload: IJwtPayload
  transactionId: number
}

export interface ITransacionCreateRequest {
  transactionBillingPlanId: number
  transactionDurationMonth: number
  transactionTotalDiscount: number
  transactionTotalUser: number
  transactionTotalPrice: number
  transactionDescription?: string
}

export interface ITransacionUpdateRequest {
  transactionId: number
}
