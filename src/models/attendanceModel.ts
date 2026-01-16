import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'
import { AttendanceInstance } from '../interfaces/attendances/attendance.dto'
import { OfficeModel } from './officeModel'
import { UserModel } from './userModel'
import { ScheduleModel } from './scheduleModel'

export const AttendanceModel = sequelize.define<AttendanceInstance>(
  'Attendances',
  {
    ...BaseModelFields,
    attendanceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    attendanceCompanyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    attendanceScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attendanceUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attendanceOfficeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attendanceTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // 'work_start',
    // 'work_end',
    // 'break_start',
    // 'break_end',
    // 'overtime_start',
    // 'overtime_end'
    attendanceCategory: {
      type: DataTypes.ENUM('checkin', 'checkout', 'breakin', 'breakout', 'otin', 'otout'),
      allowNull: false
    },
    attendancePhoto: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attendanceLatitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attendanceLongitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attendanceDistanceFromOffice: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'attendances',
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
)

AttendanceModel.belongsTo(OfficeModel, { foreignKey: 'attendanceOfficeId', as: 'office' })
OfficeModel.hasOne(AttendanceModel, {
  foreignKey: 'attendanceOfficeId',
  as: 'attendance'
})
AttendanceModel.belongsTo(UserModel, { foreignKey: 'attendanceUserId', as: 'user' })
UserModel.hasOne(AttendanceModel, { foreignKey: 'attendanceUserId', as: 'attendance' })

AttendanceModel.belongsTo(ScheduleModel, {
  foreignKey: 'attendanceScheduleId',
  as: 'schedule'
})
ScheduleModel.hasOne(AttendanceModel, {
  foreignKey: 'attendanceScheduleId',
  as: 'attendance'
})
