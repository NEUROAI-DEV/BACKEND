/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('watch_lists', {
      ...BaseModelFields,
      watch_list_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      watch_list_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      watch_list_coin_ids: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('watch_lists')
  }
}
