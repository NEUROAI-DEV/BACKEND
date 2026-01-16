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
      transaction_billing_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_billing_plan_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      transaction_plan_category: {
        type: DataTypes.ENUM('trial', 'subscription', 'custom'),
        allowNull: false
      },
      transaction_company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_total_user: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'cancel'),
        allowNull: false,
        defaultValue: 'unpaid'
      },
      transaction_total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      transaction_duration_month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_total_discount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      transaction_method: {
        type: DataTypes.ENUM('manual', 'transfer', 'gateway', 'admin'),
        allowNull: false
      },
      transaction_reference_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      transaction_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      transaction_paid_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      transaction_due_date: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('transactions')
  }
}
