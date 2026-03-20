import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'
import { ISubscriptionPlanAttributes } from './subscriptionPlanModel'
import { UserModel } from './userModel'

export type TransactionStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface ITransactionAttributes extends IBaseModelFields {
  transactionId: number
  transactionUserId: number
  transactionSubscriptionSnapshot: ISubscriptionPlanAttributes
  transactionAmount: number
  transactionStatus: TransactionStatus
  transactionProvider?: string | null
  transactionExternalId?: string | null
  transactionErrorMessage?: string | null
  transactionPaidAt?: Date | null
}

export type ITransactionCreationAttributes = Omit<
  ITransactionAttributes,
  'transactionId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface TransactionInstance
  extends Model<ITransactionAttributes, ITransactionCreationAttributes>,
    ITransactionAttributes {}

export const TransactionModel = sequelizeInit.define<TransactionInstance>(
  'Transactions',
  {
    ...BaseModelFields,
    transactionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    transactionUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    transactionSubscriptionSnapshot: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {}
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(18, 8),
      allowNull: false
    },
    transactionStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    transactionProvider: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    transactionExternalId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    transactionErrorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transactionPaidAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'transactions',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)

TransactionModel.belongsTo(UserModel, { foreignKey: 'transactionUserId', as: 'user' })

UserModel.hasMany(TransactionModel, {
  foreignKey: 'transactionUserId',
  as: 'transactions'
})
