/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('smart_wallet_trackers', {
      ...BaseModelFields,
      smart_wallet_tracker_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      smart_wallet_tracker_smart_wallet_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      smart_wallet_tracker_wallet_address: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      smart_wallet_tracker_token_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      smart_wallet_tracker_inflow: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
      },
      smart_wallet_tracker_outflow: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('smart_wallet_trackers')
  }
}
