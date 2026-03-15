/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('live_predicts', {
      ...BaseModelFields,
      live_predict_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      live_predict_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      live_predict_symbols: {
        type: DataTypes.JSON,
        allowNull: false
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('live_predicts')
  }
}
