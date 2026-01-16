/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('subscriptions', {
      ...BaseModelFields,
      subscription_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      subscription_company_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      subscription_billing_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      subscription_plan_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subscription_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      subscription_duration_month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      subscription_max_user: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      subscription_max_office: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      subscription_status: {
        type: DataTypes.ENUM('active', 'inactive', 'cancelled'),
        allowNull: false,
        defaultValue: 'active'
      },
      subscription_plan: {
        type: DataTypes.ENUM('trial', 'subscription', 'custom'),
        allowNull: false,
        defaultValue: 'trial'
      },
      subscription_start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      subscription_end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      subscription_next_billing_date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('subscriptions')
  }
}
