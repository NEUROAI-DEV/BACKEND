import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IOfficeAttributes extends IBaseModelFields {
  officeId: number
  officeCompanyId: number
  officeName: string
  officeAddress: string
  officeLongitude: string
  officeLatitude: string
  officeMaximumDistanceAttendance: number
  officeWifiMacAddress?: string
}

export type IOfficeCreationAttributes = Omit<
  IOfficeAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface OfficeInstance
  extends Model<IOfficeAttributes, IOfficeCreationAttributes>,
    IOfficeAttributes {}
