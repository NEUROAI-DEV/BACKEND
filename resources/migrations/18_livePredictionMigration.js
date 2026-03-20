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
      live_predict_symbol: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      live_predict_icon: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      live_predict_interval: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '1h'
      },
      live_predict_last_price: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: true
      },
      live_predict_results: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('live_predicts')
  }
}
