/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('smart_wallets', {
      ...BaseModelFields,
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      wallet_address: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true
      },
      total_profit_usd: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
      },
      win_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      trade_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      smart_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_smart: {
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
