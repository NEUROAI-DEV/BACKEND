import { Model } from 'sequelize'
import { IBaseModelFields } from '../../database/baseModelFields'

export interface ITransactionAttributes extends IBaseModelFields {
  transactionId: number
  transactionBillingPlanId: number
  transactionBillingPlanName: string
  transactionPlanCategory: 'trial' | 'subscription' | 'custom'
  transactionCompanyId: number
  transactionUserId: number
  transactionTotalUser: number
  transactionStatus: 'unpaid' | 'paid' | 'cancel'
  transactionTotalPrice: number
  transactionDurationMonth: number
  transactionTotalDiscount: number
  transactionMethod: 'manual' | 'transfer' | 'gateway' | 'admin'
  transactionReferenceId?: string
  transactionDescription?: string
  transactionPaidAt?: Date
  transactionDueDate?: Date
}

export type ITransactionCreationAttributes = Omit<
  ITransactionAttributes,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface TransactionInstance
  extends Model<ITransactionAttributes, ITransactionCreationAttributes>,
    ITransactionAttributes {}
