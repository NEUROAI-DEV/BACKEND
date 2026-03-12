/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('subscription_plans', {
      ...BaseModelFields,
      subscription_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      subscription_plan_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      subscription_plan_order: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      subscription_plan_description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      subscription_plan_price_monthly: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false
      },
      subscription_plan_price_yearly: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: true
      },
      subscription_plan_interval: {
        type: DataTypes.ENUM('MONTHLY', 'YEARLY'),
        allowNull: false,
        defaultValue: 'MONTHLY'
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('subscription_plans')
  }
}
