import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IAttendanceAttributes extends IBaseModelFields {
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

export type IAttendanceCreationAttributes = Omit<
  IAttendanceAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface AttendanceInstance
  extends Model<IAttendanceAttributes, IAttendanceCreationAttributes>,
    IAttendanceAttributes {}
