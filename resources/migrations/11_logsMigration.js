/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('logs', {
      ...BaseModelFields,
      log_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      log_level: {
        type: DataTypes.ENUM('error', 'warn', 'info'),
        allowNull: false
      },
      log_message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      log_source: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      log_meta: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('logs')
  }
}
