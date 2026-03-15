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
        type: DataTypes.STRING(255),
        allowNull: false
      },
      smart_wallet_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('smart_wallets')
  }
}
