import { DataTypes } from 'sequelize'
import { OfficeInstance } from '../interfaces/office/office.dto'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'
import { MembershipModel } from './membershipModel'

export const OfficeModel = sequelize.define<OfficeInstance>(
  'Offices',
  {
    ...BaseModelFields,
    officeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    officeCompanyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    officeName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    officeAddress: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    officeLongitude: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    officeLatitude: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    officeMaximumDistanceAttendance: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1000
    },
    officeWifiMacAddress: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  },
  {
    tableName: 'offices',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)
