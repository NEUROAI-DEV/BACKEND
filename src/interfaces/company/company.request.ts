import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface ICompanyFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  companyId: number
}

export interface ICompanyFindDetailRequest {
  jwtPayload: IJwtPayload
  companyId: number
}

export interface ICompanyRemoveRequest extends ICompanyFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface ICompanyUpdateRequest {
  jwtPayload: IJwtPayload
  companyId: number
  companyName?: string
  companyIndustry?: string
  companyInviteCode?: string
}
