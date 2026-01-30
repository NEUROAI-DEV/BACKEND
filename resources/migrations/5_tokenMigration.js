/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tokens', {
      ...BaseModelFields,
      token_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      token_contract_address: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true
      },
      token_name: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      token_symbol: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      token_decimals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 18
      },
      token_chain: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'ethereum'
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('tokens')
  }
}
