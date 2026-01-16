import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IScheduleCreateRequest {
  jwtPayload: IJwtPayload
  scheduleId: number
  scheduleCompanyId?: number
  scheduleName: string
  scheduleOfficeId: number
  scheduleStart: string
  scheduleEnd: string
  scheduleCategory: 'regular' | 'libur'
  scheduleOrder: number
}

export interface IScheduleFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  scheduleId: number
  officeId: number
  scheduleCategory: 'regular' | 'libur'
}

export interface IScheduleFindDetailRequest {
  jwtPayload: IJwtPayload
  scheduleId: number
}

export interface IScheduleRemoveRequest extends IScheduleFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface IScheduleUpdateRequest {
  jwtPayload: IJwtPayload
  scheduleId: number
  scheduleOrder?: number
  scheduleCompanyId?: number
  scheduleName?: string
  scheduleOfficeId?: number
  scheduleStart?: string
  scheduleEnd?: string
  scheduleCategory?: 'regular' | 'libur'
}
