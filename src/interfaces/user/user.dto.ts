import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface IUserAttributes extends IBaseModelFields {
  userId: number
  userName: string
  userPassword: string
  userEmail: string
  userRole: 'admin' | 'superAdmin' | 'user'
  userOnboardingStatus?: 'waiting' | 'completed'
}

export type IUserCreationAttributes = Omit<
  IUserAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface UserInstance
  extends Model<IUserAttributes, IUserCreationAttributes>,
    IUserAttributes {}
