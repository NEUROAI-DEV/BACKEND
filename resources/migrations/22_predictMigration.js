/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('predicts', {
      ...BaseModelFields,
      predict_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      predict_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      predict_symbol: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      predict_coin_icon: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      predict_type: {
        type: DataTypes.ENUM('SCALPING', 'SWING', 'INVESTING'),
        allowNull: false,
        defaultValue: 'SCALPING'
      },
      predict_price: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      predict_take_profit: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      predict_stop_loss: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      predict_entry_price: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      predict_reason: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      predict_potential_gain: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      predict_potential_loss: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      prediction_direction: {
        type: DataTypes.ENUM('BULLISH', 'SIDEWAYS', 'BEARISH'),
        allowNull: false,
        defaultValue: 'SIDEWAYS'
      },
      prediction_last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('predicts')
  }
}
