import { DataTypes } from 'sequelize'
import { BaseModelFields } from '../database/baseModelFields'
import { sequelize } from '../database/config'
import { TransactionInstance } from '../interfaces/transaction/transaction.dto'
import { CompanyModel } from './companyModel'

export const TransactionModel = sequelize.define<TransactionInstance>(
  'Transactions',
  {
    ...BaseModelFields,
    transactionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    transactionBillingPlanId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionBillingPlanName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionPlanCategory: {
      type: DataTypes.ENUM('trial', 'subscription', 'custom'),
      allowNull: false
    },
    transactionCompanyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionTotalUser: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionStatus: {
      type: DataTypes.ENUM('unpaid', 'paid', 'cancel'),
      allowNull: false,
      defaultValue: 'unpaid'
    },
    transactionTotalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    transactionDurationMonth: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionTotalDiscount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionMethod: {
      type: DataTypes.ENUM('manual', 'transfer', 'gateway', 'admin'),
      allowNull: false
    },
    transactionReferenceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transactionPaidAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transactionDueDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'transactions',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)

TransactionModel.belongsTo(CompanyModel, {
  foreignKey: 'transactionCompanyId',
  as: 'company'
})

CompanyModel.hasOne(TransactionModel, {
  foreignKey: 'transactionCompanyId',
  as: 'transaction'
})
