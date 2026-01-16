import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IScheduleAttributes extends IBaseModelFields {
  scheduleId: number
  scheduleCompanyId?: number
  scheduleName: string
  scheduleOfficeId: number
  scheduleStart: string
  scheduleEnd: string
  scheduleCategory: 'regular' | 'libur'
  scheduleOrder: number
}

export type IScheduleCreationAttributes = Omit<
  IScheduleAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface ScheduleInstance
  extends Model<IScheduleAttributes, IScheduleCreationAttributes>,
    IScheduleAttributes {}
