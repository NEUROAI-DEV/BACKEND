import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { ScheduleInstance } from '../interfaces/schedule/schedule.dto'
import { BaseModelFields } from '../database/baseModelFields'
import { OfficeModel } from './officeModel'

export const ScheduleModel = sequelize.define<ScheduleInstance>(
  'Schedules',
  {
    ...BaseModelFields,
    scheduleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    scheduleCompanyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    scheduleName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    scheduleOfficeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Office',
        key: 'officeId'
      }
    },
    scheduleStart: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scheduleEnd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scheduleCategory: {
      type: DataTypes.ENUM('regular', 'libur'),
      allowNull: true,
      defaultValue: 'regular'
    },
    scheduleOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'schedules',
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
)

ScheduleModel.belongsTo(OfficeModel, { foreignKey: 'scheduleOfficeId', as: 'office' })
OfficeModel.hasMany(ScheduleModel, { foreignKey: 'scheduleOfficeId', as: 'schedules' })
