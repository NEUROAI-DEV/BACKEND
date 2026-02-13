import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export type LogLevel = 'error' | 'warn' | 'info'

export interface ILogAttributes extends IBaseModelFields {
  logId: number
  logLevel: LogLevel
  logMessage: string
  logSource: string | null
  logMeta: string | null
}

export type ILogCreationAttributes = Omit<
  ILogAttributes,
  'logId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface LogInstance
  extends Model<ILogAttributes, ILogCreationAttributes>,
    ILogAttributes {}

export const LogModel = sequelizeInit.define<LogInstance>(
  'Logs',
  {
    ...BaseModelFields,
    logId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    logLevel: {
      type: DataTypes.ENUM('error', 'warn', 'info'),
      allowNull: false
    },
    logMessage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    logSource: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logMeta: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'logs',
    timestamps: true,
    paranoid: false,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB'
  }
)
