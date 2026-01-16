import { DataTypes } from 'sequelize'
import { BaseModelFields } from '../database/baseModelFields'
import { sequelize } from '../database/config'
import { CompanyInstance } from '../interfaces/company/company.dto'

export const CompanyModel = sequelize.define<CompanyInstance>(
  'Companies',
  {
    ...BaseModelFields,
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    companyIndustry: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    companyInviteCode: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'companies',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)
