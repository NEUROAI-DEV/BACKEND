/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('memberships', {
      ...BaseModelFields,
      membership_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      membership_user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      membership_company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      membership_role: {
        type: DataTypes.ENUM('company', 'employee'),
        allowNull: true
      },
      membership_status: {
        type: DataTypes.ENUM('active', 'deactivate', 'pending', 'rejected'),
        allowNull: true,
        defaultValue: 'active'
      },
      membership_office_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('memberships')
  }
}
