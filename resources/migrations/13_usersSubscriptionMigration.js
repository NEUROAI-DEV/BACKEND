/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    const tableName = 'users'
    const tableDesc = await queryInterface.describeTable(tableName)

    const columns = {
      user_subscription_status: {
        type: DataTypes.ENUM('active', 'inactive', 'expired'),
        allowNull: true,
        defaultValue: 'inactive'
      },
      user_subscription_start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_subscription_end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      user_subscription_plan: {
        type: DataTypes.ENUM('free', 'pro', 'enterprise'),
        allowNull: true,
        defaultValue: 'free'
      }
    }

    for (const [columnName, definition] of Object.entries(columns)) {
      if (!tableDesc[columnName]) {
        await queryInterface.addColumn(tableName, columnName, definition)
      }
    }
  },

  async down(queryInterface) {
    const tableName = 'users'
    const tableDesc = await queryInterface.describeTable(tableName)

    const columnNames = [
      'user_subscription_status',
      'user_subscription_start_date',
      'user_subscription_end_date',
      'user_subscription_plan'
    ]

    for (const columnName of columnNames) {
      if (tableDesc[columnName]) {
        await queryInterface.removeColumn(tableName, columnName)
      }
    }
  }
}
