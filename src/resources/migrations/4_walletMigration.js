/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('wallets', {
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
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('wallets')
  }
}
