import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IMembershipAttributes extends IBaseModelFields {
  membershipId: number
  membershipUserId: number
  membershipCompanyId: number
  membershipRole: 'company' | 'employee'
  membershipStatus: 'active' | 'pending' | 'rejected'
  membershipOfficeId?: number | null
}

export type IMembershipCreationAttributes = Omit<
  IMembershipAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface MembershipInstance
  extends Model<IMembershipAttributes, IMembershipCreationAttributes>,
    IMembershipAttributes {}
