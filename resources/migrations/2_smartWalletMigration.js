/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('smart_wallets', {
      ...BaseModelFields,
      smart_wallet_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      smart_wallet_address: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true
      },
      smart_wallet_total_profit_usd: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
      },
      smart_wallet_win_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      smart_wallet_trade_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      smart_wallet_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      smart_wallet_is_smart: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('smart_wallets')
  }
}
