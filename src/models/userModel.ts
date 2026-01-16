import { DataTypes } from 'sequelize'
import { UserInstance } from '../interfaces/user/user.dto'
import { BaseModelFields } from '../database/baseModelFields'
import { sequelize } from '../database/config'

export const UserModel = sequelize.define<UserInstance>(
  'Users',
  {
    ...BaseModelFields,
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userWhatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userRole: {
      type: DataTypes.ENUM('admin', 'superAdmin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    userDeviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '_'
    },
    userOnboardingStatus: {
      type: DataTypes.ENUM('waiting', 'completed'),
      allowNull: true,
      defaultValue: 'waiting'
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
