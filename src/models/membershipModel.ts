import { DataTypes } from 'sequelize'
import { BaseModelFields } from '../database/baseModelFields'
import { sequelize } from '../database/config'
import { MembershipInstance } from '../interfaces/membership/membership.dto'
import { UserModel } from './userModel'
import { OfficeModel } from './officeModel'

export const MembershipModel = sequelize.define<MembershipInstance>(
  'Memberships',
  {
    ...BaseModelFields,
    membershipId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    membershipUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    membershipCompanyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    membershipRole: {
      type: DataTypes.ENUM('company', 'employee'),
      allowNull: true
    },
    membershipStatus: {
      type: DataTypes.ENUM('active', 'deactivate', 'pending', 'rejected'),
      allowNull: true,
      defaultValue: 'active'
    },
    membershipOfficeId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'memberships',
    timestamps: false,
    underscored: true,
    freezeTableName: true
  }
)

MembershipModel.belongsTo(UserModel, { foreignKey: 'membershipUserId', as: 'employee' })
UserModel.hasOne(MembershipModel, { foreignKey: 'membershipUserId', as: 'memberships' })

MembershipModel.belongsTo(OfficeModel, {
  foreignKey: 'membershipOfficeId',
  as: 'office'
})

OfficeModel.hasMany(MembershipModel, {
  foreignKey: 'membershipOfficeId',
  as: 'memberships'
})
