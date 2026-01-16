import { IJwtPayload } from '../shared/jwt.interface'
import { IPaginationRequest } from '../shared/paginationRequest.interface'

export interface IAttendanceCreateRequest {
  jwtPayload: IJwtPayload
  attendanceId: number
  attendanceCompanyId?: number
  attendanceScheduleId: number
  attendanceUserId: number
  attendanceOfficeId: number
  attendanceTime: string
  attendancePhoto: string
  attendanceCategory: 'checkin' | 'checkout' | 'breakin' | 'breakout' | 'otin' | 'otout'
  attendanceLatitude?: string | null
  attendanceLongitude?: string | null
  attendanceDistanceFromOffice?: number | null
}

export interface IAttendanceFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  attendanceId: number
  attendanceCategory: string
  attendanceScheduleId: number
  officeId: number
}

export interface IAttendanceFindDetailRequest {
  jwtPayload: IJwtPayload
  attendanceId: number
}

export interface IAttendanceFindLastRequest {
  jwtPayload: IJwtPayload
  scheduleId: number
}

export interface IAttendanceRemoveRequest extends IAttendanceFindDetailRequest {
  jwtPayload: IJwtPayload
}

export interface IAttendanceUpdateRequest {
  jwtPayload: IJwtPayload
  attendanceId: number
  attendanceCompanyId?: number
  attendanceScheduleId: number
  attendanceUserId: number
  attendanceOfficeId: number
  attendanceTime: string
  attendancePhoto: string
  attendanceCategory: 'checkin' | 'checkout' | 'breakin' | 'breakout' | 'otin' | 'otout'
  attendanceLatitude?: string | null
  attendanceLongitude?: string | null
  attendanceDistanceFromOffice?: number | null
}

export interface IAttendanceHistoryFindAllRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  attendanceHistoryUserId: number
}

export interface IAttendanceHistoryFindDetailRequest extends IPaginationRequest {
  jwtPayload: IJwtPayload
  attendanceHistoryId: number
}
