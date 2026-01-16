/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('billing_plans', {
      ...BaseModelFields,
      billing_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      billing_plan_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      billing_plan_category: {
        type: DataTypes.ENUM('trial', 'subscription', 'custom'),
        allowNull: false,
        defaultValue: 'trial'
      },
      billing_plan_price_per_user: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      billing_plan_duration_month: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      billing_plan_discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('billing_plans')
  }
}
