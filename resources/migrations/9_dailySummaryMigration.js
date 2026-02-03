/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('daily_summaries', {
      ...BaseModelFields,

      daily_summary_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      daily_summary_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
      },

      daily_summary_market_sentiment: {
        type: DataTypes.ENUM('BULLISH', 'NEUTRAL', 'BEARISH'),
        allowNull: false
      },

      daily_summary_confidence: {
        type: DataTypes.DECIMAL(5, 4),
        allowNull: false
      },

      daily_summary_summary: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      daily_summary_highlights: {
        type: DataTypes.JSON,
        allowNull: false
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('daily_summaries')
  }
}
