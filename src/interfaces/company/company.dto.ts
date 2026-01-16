import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface ICompanyAttributes extends IBaseModelFields {
  companyId: number
  companyName: string
  companyIndustry: string
  companyInviteCode: string
}

export type ICompanyCreationAttributes = Omit<
  ICompanyAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface CompanyInstance
  extends Model<ICompanyAttributes, ICompanyCreationAttributes>,
    ICompanyAttributes {}
