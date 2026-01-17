import { DataTypes } from 'sequelize'
import { sequelize } from '../database/config'
import { BaseModelFields } from '../database/baseModelFields'

export const WalletModel = sequelize.define(
  'Wallets',
  {
    ...BaseModelFields,
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    walletAddress: {
      type: DataTypes.STRING(42),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'wallets',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
