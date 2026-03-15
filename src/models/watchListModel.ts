import { DataTypes, Model } from 'sequelize'
import { sequelizeInit } from '../configs/database'
import { BaseModelFields, IBaseModelFields } from '../interfaces/baseModelFields'

export interface IWatchListAttributes extends IBaseModelFields {
  watchListId: number
  watchListUserId: number
  watchListCoinIds: string
}

export type IWatchListCreationAttributes = Omit<
  IWatchListAttributes,
  'watchListId' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

export interface WatchListInstance
  extends Model<IWatchListAttributes, IWatchListCreationAttributes>,
    IWatchListAttributes {}

export const WatchListModel = sequelizeInit.define<WatchListInstance>(
  'WatchLists',
  {
    ...BaseModelFields,
    watchListId: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    watchListUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    watchListCoinIds: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'watch_lists',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true
  }
)
