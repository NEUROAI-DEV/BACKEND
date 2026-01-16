import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IOfficeCreateRequest {
  jwtPayload: IJwtPayload
  membershipCompanyId: number
  officeCompanyId: number
  officeId: number
  officeName: string
  officeAddress: string
  officeLongitude: string
  officeLatitude: string
  officeMaximumDistanceAttendance: number
  officeWifiMacAddress?: string
}

export interface IOfficeFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  membershipCompanyId: number
  officeId: number
}

export interface IOfficeFindDetailRequest {
  jwtPayload: IJwtPayload
  membershipCompanyId: number
  officeId: number
}

export interface IOfficeRemoveRequest extends IOfficeFindDetailRequest {
  jwtPayload: IJwtPayload
  membershipCompanyId: number
  officeId: number
}

export interface IOfficeUpdateRequest {
  jwtPayload: IJwtPayload
  membershipCompanyId: number
  officeId: number
  officeCompanyId?: number
  officeName?: string
  officeAddress?: string
  officeLongitude?: string
  officeLatitude?: string
  officeMaximumDistanceAttendance?: number
  officeWifiMacAddress?: string
}

export interface IOfficeLocationFindAllRequest extends IPaginationRequest {}
