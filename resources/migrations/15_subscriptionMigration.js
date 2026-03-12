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
      subscription_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      subscription_subscription_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      subscription_status: {
        type: DataTypes.ENUM('TRIALING', 'ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE'),
        allowNull: false,
        defaultValue: 'TRIALING'
      },
      subscription_start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      subscription_end_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      subscription_trial_end_date: {
        type: DataTypes.DATE,
        allowNull: true
      }
    })
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('subscriptions')
  }
}
