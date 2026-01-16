import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IMembershipCreateRequest {
  jwtPayload: IJwtPayload
  membershipId: number
  membershipUserId: number
  membershipCompanyId: number
  membershipRole: 'company' | 'employee'
  membershipStatus: 'active' | 'pending' | 'rejected'
  membershipOfficeId?: number | null
}

export interface IMembershipFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
}

export interface IMembershipRemoveRequest {
  jwtPayload: IJwtPayload
  membershipId: number
}

export interface IMembershipUpdateRequest {
  jwtPayload: IJwtPayload
  membershipId: number
  membershipStatus: 'active' | 'pending' | 'rejected'
  membershipOfficeId?: number | null
}

export interface IMembershipInviteRequest {
  jwtPayload: IJwtPayload
  inviteCode: string
}
