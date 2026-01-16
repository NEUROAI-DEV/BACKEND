/* eslint-disable @typescript-eslint/space-before-function-paren */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const { BaseModelFields } = require('../baseModel')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('companies', {
      ...BaseModelFields,
      company_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      company_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      company_industry: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      company_invite_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      }
    })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('companies')
  }
}
