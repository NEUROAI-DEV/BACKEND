/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tokens', {
      ...BaseModelFields,
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      contract_address: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      symbol: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      decimals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 18
      },
      chain: {
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
