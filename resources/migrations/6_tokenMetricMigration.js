/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('token_metrics', {
      ...BaseModelFields,
      token_metric_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      token_metric_token_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      token_metric_price_usd: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_price_change24h: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      token_metric_market_cap_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_dex_volume24h_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_liquidity_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_dex_buy24h_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_dex_sell24h_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      },
      token_metric_dex_flow24h_usd: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('token_metrics')
  }
}
