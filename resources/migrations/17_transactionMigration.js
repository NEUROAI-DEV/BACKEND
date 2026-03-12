/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('transactions', {
      ...BaseModelFields,
      transaction_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      transaction_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      transaction_subscription_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      transaction_amount: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      transaction_status: {
        type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      transaction_provider: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      transaction_external_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      transaction_error_message: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      transaction_paid_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('transactions')
  }
}
