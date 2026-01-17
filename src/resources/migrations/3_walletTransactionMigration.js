/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('wallet_transactions', {
      ...BaseModelFields,
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      wallet_address: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      tx_hash: {
        type: DataTypes.STRING(66),
        allowNull: false,
        unique: true
      },
      from_address: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      to_address: {
        type: DataTypes.STRING(42),
        allowNull: false
      },
      token_address: {
        type: DataTypes.STRING(42),
        allowNull: true
      },
      token_symbol: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      value: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
      },
      tx_type: {
        type: DataTypes.ENUM('BUY', 'SELL'),
        allowNull: false
      },
      price_usd: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        defaultValue: 0
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('wallet_transactions')
  }
}
